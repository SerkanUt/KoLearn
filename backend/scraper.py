"""
Naver News scraper for Korean language learning app.
Scrapes international news section (104) and stores title, link, content in MongoDB.
"""

import os
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

SECTION_URL = "https://news.naver.com/section/104"
MAX_ARTICLES = 10  # number of articles to scrape
REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}


def get_article_links(soup, limit=MAX_ARTICLES):
    """Extract article links from section page."""
    links = soup.select("a.sa_text_title")
    seen = set()
    out = []
    for a in links[: limit * 2]:  # allow some duplicates
        href = a.get("href")
        title = a.get_text(strip=True)
        if href and title and href not in seen:
            seen.add(href)
            out.append({"title": title, "href": href})
            if len(out) >= limit:
                break
    return out


def get_article_content(url):
    """Fetch a single article page and extract text from #dic_area."""
    try:
        resp = requests.get(url, headers=REQUEST_HEADERS, timeout=10)
        resp.raise_for_status()
    except requests.RequestException:
        return ""
    soup = BeautifulSoup(resp.text, "lxml")
    article = soup.find("article", id="dic_area")
    if not article:
        return ""
    return article.get_text(separator="\n", strip=True)


def scrape_naver_news(limit=MAX_ARTICLES):
    """Scrape Naver international news section; return list of {title, link, content}."""
    try:
        resp = requests.get(SECTION_URL, headers=REQUEST_HEADERS, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"Failed to fetch section: {e}")
        return []

    soup = BeautifulSoup(resp.text, "lxml")
    items = get_article_links(soup, limit=limit)
    results = []

    for item in items:
        content = get_article_content(item["href"])
        results.append({
            "title": item["title"],
            "link": item["href"],
            "content": content,
        })

    return results


def save_to_mongodb(articles, db_name="naver_news", collection_name="international"):
    """Replace collection contents with new articles."""
    mongo_uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client[db_name]
    coll = db[collection_name]
    coll.delete_many({})
    if articles:
        coll.insert_many(articles)
    client.close()
    return len(articles)


def run_scraper(limit=MAX_ARTICLES, save=True):
    """Scrape and optionally save to MongoDB. Returns list of articles."""
    articles = scrape_naver_news(limit=limit)
    if save and articles:
        save_to_mongodb(articles)
    return articles


if __name__ == "__main__":
    run_scraper(save=True)
    print("Scrape complete. Check MongoDB naver_news.international.")
