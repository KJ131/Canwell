from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/wells", tags=["wells"])

@router.get("/", response_model=list[schemas.Well])
def get_wells(
    skip: int = 0,
    limit: int = 100,
    status: str | None = None,
    operator: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Well)
    if status:
        query = query.filter(models.Well.status == status)
    if operator:
        query = query.filter(models.Well.operator.contains(operator))
    return query.order_by(models.Well.id).offset(skip).limit(limit).all()

@router.get("/{well_id}", response_model=schemas.Well)
def get_well(well_id: int, db: Session = Depends(get_db)):
    well = db.query(models.Well).filter(models.Well.id == well_id).first()
    if well is None:
        raise HTTPException(status_code=404, detail="Well not found")
    return well

@router.get("/{well_id}/production", response_model=list[schemas.ProductionLog])
def get_well_production(well_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.ProductionLog)
        .filter(models.ProductionLog.well_id == well_id)
        .order_by(models.ProductionLog.log_date)
        .all()
    )

@router.post("/", response_model=schemas.Well)
def create_well(well: schemas.WellCreate, db: Session = Depends(get_db)):
    new_well = models.Well(**well.dict())
    db.add(new_well)
    db.commit()
    db.refresh(new_well)
    return new_well