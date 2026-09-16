import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "mssql+pyodbc://sa:CanWell123!Strong@localhost:1433/canwell?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes",
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
