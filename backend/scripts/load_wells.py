import pandas as pd
from app.database import SessionLocal, Base, engine
from app import models

Base.metadata.create_all(bind=engine)

df = pd.read_excel("data/raw/ST37_SH.xlsx")

db = SessionLocal()

for index, row in df.iterrows():
    well = models.Well(
        well_licence_number=row["Well_Licence_Number"],
        name=row["Licence_Surface_Location_Label"],
        operator=row["Licensee"],
        province="Alberta",
        region="Alberta",
        latitude=row["SH_Actual_Latitude"],
        longitude=row["SH_Actual_Longitude"],
        status=row["Licence_Status"],
    )
    db.add(well)

db.commit()
db.close()

print("Done")