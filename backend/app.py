"""
Flask API for Lingoistics app.
- GET /news: returns scraped Naver news from MongoDB (for Daily tab).
- POST /scrape: triggers scraper and refreshes MongoDB.
- POST /story: stub for story generation (replace with your logic or keep using Node server).
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

from scraper import run_scraper

app = Flask(__name__)
CORS(app)

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME = "naver_news"
COLLECTION_NAME = "international"


def get_collection():
    client = MongoClient(MONGODB_URI)
    return client[DB_NAME][COLLECTION_NAME]


@app.route("/news", methods=["GET"])
def news():
    """Return list of { title, link, content } from MongoDB."""
    try:
        coll = get_collection()
        articles = list(coll.find({}, {"_id": 0, "title": 1, "link": 1, "content": 1}))
        return jsonify(articles)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/scrape", methods=["POST"])
def scrape():
    """Run Naver scraper and refresh MongoDB."""
    try:
        limit = request.json.get("limit", 10) if request.is_json else 10
        run_scraper(limit=limit, save=True)
        return jsonify({"ok": True, "message": "Scrape complete"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/story", methods=["POST"])
def story():
    """
    Stub: accept { words: string[] }, return { story: string }.
    Replace this with your real story-generation logic (e.g. LLM or existing Node service).
    """
    try:
        data = request.get_json() or {}
        words = data.get("words", [])
        if not words:
            return jsonify({"story": "Enter some words to generate a story."})
        # Placeholder: echo words back as a simple "story"
        story_text = " ".join(words) + "."
        return jsonify({"story": story_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
