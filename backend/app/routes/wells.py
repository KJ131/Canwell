from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/wells", tags=["wells"])

@router.get("/", response_model=list[schemas.Well])
def get_wells(db: Session = Depends(get_db)):
    return db.query(models.Well).all()

@router.post("/", response_model=schemas.Well)
def create_well(well: schemas.WellCreate, db: Session = Depends(get_db)):
    new_well = models.Well(**well.dict())
    db.add(new_well)
    db.commit()
    db.refresh(new_well)
    return new_well