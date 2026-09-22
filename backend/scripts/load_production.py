import glob
import pandas as pd
from datetime import datetime
from app.database import SessionLocal
from app import models
from scripts.uwi import decode_uwi

files = sorted(glob.glob("data/raw/production/*.CSV"))
print(f"found {len(files)} files")

db = SessionLocal()

print("loading wells into memory...")
well_lookup = {name: id_ for id_, name in db.query(models.Well.id, models.Well.name)}
print(f"loaded {len(well_lookup)} wells")

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
    logs = []

    for index, row in oil_wells.iterrows():
        location_code = decode_uwi(row["FromToIDIdentifier"])
        well_id = well_lookup.get(location_code)

        if well_id is None:
            not_found += 1
            continue

        logs.append(models.ProductionLog(
            well_id=well_id,
            production_bpd=row["Volume"],
            log_date=datetime.strptime(row["ProductionMonth"], "%Y-%m").date(),
        ))
        matched += 1

    db.bulk_save_objects(logs)
    db.commit()

    total_matched += matched
    total_not_found += not_found
    print(f"{filepath}: matched={matched}, not_found={not_found}")

db.close()
print(f"TOTAL: matched={total_matched}, not_found={total_not_found}")