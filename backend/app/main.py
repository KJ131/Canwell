from fastapi import FastAPI
from app.routes import wells
from app.database import Base, engine
from app import models



app = FastAPI()

app.include_router(wells.router)

Base.metadata.create_all(bind=engine)
