def decode_uwi(uwi: str) -> str:
    lsd = uwi[3:5]
    section = uwi[5:7]
    township = uwi[7:10]
    range_ = uwi[10:12]
    meridian = uwi[12:14]
    return f"{lsd}-{section}-{township}-{range_}{meridian}"