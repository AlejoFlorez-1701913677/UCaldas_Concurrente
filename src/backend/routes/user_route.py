from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext
from database.mongo import Database

from models.user_create import UserCreate
from response.user_response import UserResponse
from .publisher import send_registration_email
import secrets
import jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import os

routerUser = APIRouter()

# Configuración para hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY") , algorithm=os.getenv("ALGORITHM") )
    return encoded_jwt

@routerUser.post("/register", response_model=UserResponse, status_code=201)
async def register_user(
    user: UserCreate,
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    users_collection = db["users"]
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    hashed_password = get_password_hash(user.password)
    # Generar una llave de acceso segura
    access_key = secrets.token_urlsafe(16)

    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "access_key": access_key  # Almacenar la llave de acceso en la base de datos
    }
    result = await users_collection.insert_one(new_user)
    user_id = str(result.inserted_id)

    # Enviar un mensaje para registrar el correo con la llave de acceso
    send_registration_email(user.email, access_key)

    return UserResponse(id=user_id, username=user.username, email=user.email)

@routerUser.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    user_collection = db["users"]
    user = await user_collection.find_one({"username": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # Verificar contraseña y access_key
    password_correct = pwd_context.verify(form_data.password, user["password"])
    access_key_correct = form_data.username + "your_salt" == user["access_key"]  # Simulando una comparación
    if not password_correct or not access_key_correct:
        raise HTTPException(status_code=400, detail="Invalid authentication credentials")

    # Crear token JWT
    access_token_expires = timedelta(minutes=int(os.getenv("TOKEN_MINUTES")))
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@routerUser.get("/createCollection")
async def main(db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    await db["users"].insert_one({"Config": "Success"})
    return "Done"