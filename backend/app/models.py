from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Well(Base):
    __tablename__ = "wells"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, index = True)
    operator = Column(String, nullable=False)
    province = Column(String, nullable=False)
    region = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    well_licence_number = Column(String, nullable = False, unique = True)
    production_logs = relationship("ProductionLog", back_populates="well")


class ProductionLog(Base):
    __tablename__ = "production_logs"

    id = Column(Integer, primary_key=True)
    well_id = Column(Integer, ForeignKey("wells.id"), nullable=False)
    production_bpd = Column(Float, nullable=False)
    log_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    well = relationship("Well", back_populates="production_logs")
