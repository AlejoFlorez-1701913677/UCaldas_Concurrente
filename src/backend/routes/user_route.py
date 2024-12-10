from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext
from database.mongo import Database


from models.user_create import UserCreate
from response.user_response import UserResponse

routerUser = APIRouter()

# Configuración para hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

@routerUser.post("/register/", response_model=UserResponse, status_code=201)
async def register_user(
    user: UserCreate,
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    users_collection = db["users"]
    # Comprobar si el email ya está registrado
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    # Hash de la contraseña
    hashed_password = get_password_hash(user.password)

    # Crear un nuevo usuario
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
    }

    # Insertar usuario en la base de datos
    result = await users_collection.insert_one(new_user)
    user_id = str(result.inserted_id)

    # Responder con los datos del usuario creado
    return UserResponse(
        id=user_id,
        username=user.username,
        email=user.email
    )

@routerUser.get("/createCollection")
async def main(db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    await db["users"].insert_one({"Config": "Success"})
    return "Done"