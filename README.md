# CanWell: Alberta Oil & Gas Well Tracker

CanWell is a full-stack web app for exploring Alberta oil and gas wells. It loads real well licence data and monthly production volumes, then lets you browse them on an interactive map, filter by operator, status and well type, and chart production over time.

## Features

- **Home page** with headline stats (total wells, oil wells, gas wells, operators).
- **Dashboard** showing total Alberta oil and gas production over time (line chart) and well counts by type.
- **Interactive map** (Leaflet) of well locations, colour-coded: green for oil, orange for gas, grey for inactive.
- **Filters** by well type, licence status, and operator name. Active wells are shown by default.
- **Well detail panel**: click a well to see its operator, status, licence number, and a production history chart.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite, React Router, Leaflet / react-leaflet, Recharts |
| Backend | Python 3.13, FastAPI, SQLAlchemy, Uvicorn |
| Database | Microsoft SQL Server (Azure SQL Edge in Docker) via `pyodbc` |
| Data loading | pandas, openpyxl |
| Deployment | Docker and Docker Compose (database and API) |

## Project structure

```
Canwell/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, router registration
│   │   ├── database.py      # SQLAlchemy engine and session
│   │   ├── models.py        # Well and ProductionLog tables
│   │   ├── schemas.py       # Pydantic response/request models
│   │   └── routes/
│   │       ├── wells.py     # /wells endpoints
│   │       └── stats.py     # /stats endpoints
│   ├── scripts/
│   │   ├── load_wells.py        # Import well licences from Excel
│   │   ├── load_production.py   # Import monthly production CSVs
│   │   └── uwi.py               # Decode UWI codes to well locations
│   ├── Dockerfile
│   ├── docker-compose.yml   # SQL Server + API
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/           # Home, Dashboard, MapPage
        ├── components/      # NavBar, Sidebar, MapView, WellDetail, KpiCards
        └── api.js           # API client
```

## Getting started

### 1. Start the database and API

From the `backend/` folder, create your own `.env` file from the template and set a password (see [Configuration](#configuration)):

```bash
cp .env.example .env      # on Windows PowerShell: Copy-Item .env.example .env
```

Then start everything:

```bash
docker compose up --build
```

This starts SQL Server on port `1433` (localhost only) and the API on `http://localhost:8000`. Interactive API docs are at `http://localhost:8000/docs`. Tables are created automatically when the API starts.

### 2. Load the data

The raw data files are not stored in this repo (`backend/data/` is git-ignored). Put them here:

```
backend/data/raw/ST37_SH.xlsx          # AER well licence list
backend/data/raw/production/*.CSV      # Monthly Petrinex production volumes
```

Then, from `backend/` with the database running and the ODBC Driver 18 for SQL Server installed locally, set `DATABASE_URL` (using the password from your `.env`) and run the loaders in this order:

```bash
# macOS / Linux
export DATABASE_URL="mssql+pyodbc://sa:YOUR_PASSWORD@localhost:1433/canwell?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"
# Windows PowerShell
# $env:DATABASE_URL = "mssql+pyodbc://sa:YOUR_PASSWORD@localhost:1433/canwell?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"

pip install -r requirements.txt
python -m scripts.load_wells
python -m scripts.load_production
```

`load_production.py` matches each production row to a well, then labels every well as `oil`, `gas`, or `inactive` based on what it has produced.

### 3. Start the frontend

From `frontend/`, copy `.env.example` to `.env` (it points the app at the API on `http://localhost:8000`), then:

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/wells/` | List wells. Query params: `skip`, `limit`, `status`, `operator`, `well_type` (`active` by default; also `oil`, `gas`, `inactive`, `all`) |
| GET | `/wells/{id}` | Get one well |
| GET | `/wells/{id}/production` | Monthly production history for a well |
| POST | `/wells/` | Create a well |
| GET | `/stats/summary` | Counts of wells, operators, and production records |
| GET | `/stats/production-trend` | Total oil and gas production per month |

## Data sources

- Well licence data from the Alberta Energy Regulator (AER).
- Monthly production volumes from Petrinex.

## Configuration

No passwords are stored in this repository. Settings come from environment variables:

| Variable | Where | Purpose |
|---|---|---|
| `MSSQL_SA_PASSWORD` | `backend/.env` (copied from `.env.example`) | Password for the SQL Server `sa` account. Docker Compose uses it to start the database and to build the API's connection string. |
| `DATABASE_URL` | set automatically by Docker Compose; set it yourself when running the API or loader scripts outside Docker | SQLAlchemy connection string. The API refuses to start without it. |
| `VITE_API_URL` | `frontend/.env` (copied from `.env.example`) | Base URL of the API the frontend talks to. |

`.env` files are git-ignored. Choose your own strong password and never commit it.

## Status

Work in progress. The backend test file (`backend/tests/test_wells.py`) is currently empty.
