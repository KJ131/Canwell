import glob
import pandas as pd
from datetime import datetime
from sqlalchemy import text
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

    prod_rows = df[
        (df["ActivityID"] == "PROD") &
        (df["ProductID"].isin(["OIL", "GAS"])) &
        (df["FromToIDType"] == "WI")
    ]

    matched = 0
    not_found = 0
    logs = []

    for index, row in prod_rows.iterrows():
        location_code = decode_uwi(row["FromToIDIdentifier"])
        well_id = well_lookup.get(location_code)

        if well_id is None:
            not_found += 1
            continue

        logs.append(models.ProductionLog(
            well_id=well_id,
            product_type=row["ProductID"],
            production_bpd=row["Volume"],
            log_date=datetime.strptime(row["ProductionMonth"], "%Y-%m").date(),
        ))
        matched += 1

    db.bulk_save_objects(logs)
    db.commit()

    total_matched += matched
    total_not_found += not_found
    print(f"{filepath}: matched={matched}, not_found={not_found}")

print(f"TOTAL: matched={total_matched}, not_found={total_not_found}")

print("computing well_type for each well...")
db.execute(text("UPDATE wells SET well_type = 'inactive'"))
db.execute(text("""
    UPDATE wells SET well_type = 'gas'
    WHERE id IN (SELECT DISTINCT well_id FROM production_logs WHERE product_type = 'GAS')
"""))
db.execute(text("""
    UPDATE wells SET well_type = 'oil'
    WHERE id IN (SELECT DISTINCT well_id FROM production_logs WHERE product_type = 'OIL')
"""))
db.commit()
print("well_type computed")

db.close()
