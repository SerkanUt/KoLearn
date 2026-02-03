# Lingoistics backend

Python backend that:

1. **Scrapes Naver News** (international section) and stores articles in MongoDB.
2. **Serves the app** via Flask:
   - `GET /news` — list of `{ title, link, content }` (used by the Daily tab).
   - `POST /scrape` — run the scraper and refresh the database.
   - `POST /story` — stub for story generation (replace with your logic if needed).

## Setup

1. **Python 3.9+** and a virtualenv:

   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **MongoDB** running locally (`mongodb://localhost:27017`) or set:

   ```bash
   set MONGODB_URI=mongodb://localhost:27017/
   ```

3. **Run the scraper once** to fill the DB:

   ```bash
   python scraper.py
   ```

4. **Start the API**:

   ```bash
   python app.py
   ```

   Server runs at `http://localhost:3000` (or `PORT` env var).

## App connection

In the Expo app, the Daily tab calls `GET http://<your-ip>:3000/news`. Use your machine’s LAN IP (e.g. `192.168.1.181`) so the phone can reach the backend:

- Either change the URL in the app to your machine’s IP (see `app/(tabs)/daily.tsx`).
- Or use a config constant for the API base URL.

To refresh news from the app or a cron job, call:

```bash
curl -X POST http://localhost:3000/scrape
```

## Story endpoint

`POST /story` is a stub that returns a trivial story. Wire it to your real story generator (e.g. another service or an LLM) if you already have one.
