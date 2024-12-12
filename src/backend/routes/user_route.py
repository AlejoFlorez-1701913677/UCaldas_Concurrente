from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database.mongo import Database

from models.user_create import UserCreate
from models.login_data import LoginData
from response.user_response import UserResponse
from .publisher import send_registration_email
import secrets
import jwt
from datetime import datetime, timedelta
import os
from argon2 import PasswordHasher

routerUser = APIRouter()
ph = PasswordHasher()

def get_password_hash(password: str) -> str:
    return ph.hash(password)

def verify_password(password: str, hash: str) -> bool:
    try:
        return ph.verify(hash, password)
    except:
        return False

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY") , algorithm=os.getenv("ALGORITHM") )
    return encoded_jwt

@routerUser.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    users_collection = db["users"]
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    access_key = secrets.token_urlsafe(16)

    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "access_key": access_key
    }
    result = await users_collection.insert_one(new_user)
    user_id = str(result.inserted_id)
    #send_registration_email(user.email, access_key)
    return UserResponse(id=user_id, username=user.username, email=user.email)

@routerUser.post("/login")
async def login(login_data: LoginData, db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    user_collection = db["users"]
    user = await user_collection.find_one({"username": login_data.username})
    #print("Se encontró un usuario" + user)
    print(user)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    password_correct = verify_password(login_data.password, user["password"])
    #print("Contraseña correcta" + password_correct)
    print(password_correct)
    #access_key_correct = login_data.access_key == user["access_key"]
    #if not password_correct or not access_key_correct:
        #raise HTTPException(status_code=400, detail="Invalid authentication credentials")

    access_token_expires = timedelta(minutes=int(os.getenv("TOKEN_MINUTES", "30")))
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@routerUser.get("/createCollection")
async def main(db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    await db["users"].insert_one({"Config": "Success"})
    return "Done"
