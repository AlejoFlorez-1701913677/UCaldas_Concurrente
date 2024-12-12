from pydantic import BaseModel

class LoginData(BaseModel):
    username: str
    password: str
    access_key: str  # Asumiendo que también necesitas la llave de acceso para el login
