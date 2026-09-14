import pandas as pd
from app.database import SessionLocal
from app import models
from scripts.uwi import decode_uwi
from datetime import datetime

df = pd.read_csv("data/raw/Vol_2024-06-AB.csv")

oil_wells = df[
    (df["ActivityID"] == "PROD") &
    (df["ProductID"] == "OIL") &
    (df["FromToIDType"] == "WI")
]

db = SessionLocal()

matched = 0
not_found = 0

for index, row in oil_wells.iterrows():
    location_code = decode_uwi(row["FromToIDIdentifier"])
    well = db.query(models.Well).filter(models.Well.name == location_code).first()

    if well is None:
        not_found += 1
        continue

    log = models.ProductionLog(
        well_id=well.id,
        production_bpd=row["Volume"],
        log_date=datetime.strptime(row["ProductionMonth"], "%Y-%m").date(),
    )
    db.add(log)
    matched += 1

db.commit()
db.close()

print(f"matched: {matched}, not_found: {not_found}")