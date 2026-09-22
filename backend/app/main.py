from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import wells
from app.database import Base, engine
from app import models



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wells.router)

Base.metadata.create_all(bind=engine)
