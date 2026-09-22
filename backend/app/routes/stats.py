from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_wells = db.query(func.count(models.Well.id)).scalar()
    active_wells = (
        db.query(func.count(models.Well.id))
        .filter(models.Well.status == "Issued")
        .scalar()
    )
    oil_wells = (
        db.query(func.count(models.Well.id))
        .filter(models.Well.well_type == "oil")
        .scalar()
    )
    gas_wells = (
        db.query(func.count(models.Well.id))
        .filter(models.Well.well_type == "gas")
        .scalar()
    )
    inactive_wells = (
        db.query(func.count(models.Well.id))
        .filter(models.Well.well_type == "inactive")
        .scalar()
    )
    operators = db.query(func.count(func.distinct(models.Well.operator))).scalar()
    total_production_logs = db.query(func.count(models.ProductionLog.id)).scalar()

    return {
        "total_wells": total_wells,
        "active_wells": active_wells,
        "oil_wells": oil_wells,
        "gas_wells": gas_wells,
        "inactive_wells": inactive_wells,
        "operators": operators,
        "total_production_logs": total_production_logs,
    }

@router.get("/production-trend")
def get_production_trend(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.ProductionLog.log_date,
            models.ProductionLog.product_type,
            func.sum(models.ProductionLog.production_bpd).label("total_bpd"),
        )
        .group_by(models.ProductionLog.log_date, models.ProductionLog.product_type)
        .order_by(models.ProductionLog.log_date)
        .all()
    )

    by_month = {}
    for r in rows:
        month = r.log_date.isoformat()[:7]
        entry = by_month.setdefault(month, {"month": month, "oil_bpd": 0, "gas_bpd": 0})
        if r.product_type == "OIL":
            entry["oil_bpd"] = float(r.total_bpd)
        elif r.product_type == "GAS":
            entry["gas_bpd"] = float(r.total_bpd)

    return sorted(by_month.values(), key=lambda x: x["month"])
