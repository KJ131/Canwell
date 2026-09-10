from pydantic import BaseModel
from datetime import date, datetime

class WellBase(BaseModel):
    name: str
    operator: str
    province: str
    region: str
    latitude: float
    longitude: float
    status: str

class WellCreate(WellBase):
    pass

class Well(WellBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductionLogBase(BaseModel):
    well_id : int
    production_bpd : float
    log_date : date
   

class ProductionLogCreate(ProductionLogBase):
    pass

class ProductionLog(ProductionLogBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
