from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/wells", tags=["wells"])

@router.get("/", response_model=list[schemas.Well])
def get_wells(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Well).order_by(models.Well.id).offset(skip).limit(limit).all()

@router.get("/{well_id}", response_model=schemas.Well)
def get_well(well_id: int, db: Session = Depends(get_db)):
    well = db.query(models.Well).filter(models.Well.id == well_id).first()
    if well is None:
        raise HTTPException(status_code=404, detail="Well not found")
    return well

@router.post("/", response_model=schemas.Well)
def create_well(well: schemas.WellCreate, db: Session = Depends(get_db)):
    new_well = models.Well(**well.dict())
    db.add(new_well)
    db.commit()
    db.refresh(new_well)
    return new_well