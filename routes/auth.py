from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Modelo
class User(BaseModel):
    correo: str
    contrasena: str

# Datos simulados
users_db = []

@router.post("/register")
def register(user: User):
    if any(u["correo"] == user.correo for u in users_db):
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    users_db.append(user.dict())
    return {"mensaje": "Usuario registrado exitosamente"}

@router.post("/login")
def login(user: User):
    for u in users_db:
        if u["correo"] == user.correo and u["contrasena"] == user.contrasena:
            return {"mensaje": "Login exitoso"}
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")