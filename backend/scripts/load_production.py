import glob
import pandas as pd
from datetime import datetime
from app.database import SessionLocal
from app import models
from scripts.uwi import decode_uwi

files = sorted(glob.glob("data/raw/production/*.CSV"))
print(f"found {len(files)} files")

db = SessionLocal()

total_matched = 0
total_not_found = 0

for filepath in files:
    df = pd.read_csv(filepath, low_memory=False)

    oil_wells = df[
        (df["ActivityID"] == "PROD") &
        (df["ProductID"] == "OIL") &
        (df["FromToIDType"] == "WI")
    ]

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

    total_matched += matched
    total_not_found += not_found
    print(f"{filepath}: matched={matched}, not_found={not_found}")

db.close()
print(f"TOTAL: matched={total_matched}, not_found={total_not_found}")