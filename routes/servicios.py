from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Modelos
class Servicio(BaseModel):
    nombre: str
    precio: float

class Mascota(BaseModel):
    correo: str
    nombre: str
    tipo_servicio: str
    fecha: str

# Datos simulados
servicios_db = [
    {"nombre": "Consulta general", "precio": 50.0},
    {"nombre": "Vacunación", "precio": 30.0},
]

mascotas_db = []

@router.get("/servicios")
def get_servicios():
    return {"servicios": servicios_db}

@router.post("/agregar-servicio")
def agregar_servicio(servicio: Servicio):
    servicios_db.append(servicio.dict())
    return {"mensaje": "Servicio agregado exitosamente"}

@router.post("/registrar-mascota")
def registrar_mascota(mascota: Mascota):
    mascotas_db.append(mascota.dict())
    return {"mensaje": "Mascota registrada exitosamente"}

@router.get("/mascotas/{correo}")
def get_mascotas(correo: str):
    mascotas = [m for m in mascotas_db if m["correo"] == correo]
    return {"mascotas": mascotas}

@router.get("/reporte/{correo}")
def get_reporte(correo: str):
    mascotas = [m for m in mascotas_db if m["correo"] == correo]
    cantidad_servicios = len(mascotas)
    total_gastado = sum(
        next((s["precio"] for s in servicios_db if s["nombre"] == m["tipo_servicio"]), 0)
        for m in mascotas
    )
    servicios_usados = list(set(m["tipo_servicio"] for m in mascotas))
    return {
        "cantidad_servicios": cantidad_servicios,
        "total_gastado": total_gastado,
        "servicios": servicios_usados,
        "correo": correo
    }