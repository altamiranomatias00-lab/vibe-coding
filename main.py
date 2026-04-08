from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ..routes.servicios import router as servicios_router
from ..routes.auth import router as auth_router

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def saludar():
    return {"mensaje": "¡Hola! Bienvenido a mi API"}


@app.get("/bienvenido/{nombre}")
def saludar_persona(nombre: str):
    return {"mensaje": f"Hola {nombre}, ¡qué bueno verte por aquí!"}


# Incluir routers modulares
app.include_router(servicios_router)
app.include_router(auth_router)
