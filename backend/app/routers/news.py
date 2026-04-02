from fastapi import APIRouter, Depends, HTTPException, Query, Header
from typing import Optional
import httpx

from app.config import settings
from app.auth.jwt import decode_token
from app.services.news_scraper import fetch_rss_feeds, scrape_web_fallback

router = APIRouter(prefix="/news", tags=["news"])


async def get_current_user_id(
    authorization: Optional[str] = Header(None, alias="Authorization"),
) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return int(payload.get("sub"))


@router.get("/")
async def get_ai_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    authorization: Optional[str] = Header(None, alias="Authorization"),
):
    await get_current_user_id(authorization)

    if settings.NEWS_API_KEY and settings.NEWS_API_KEY != "your-newsapi-key-here":
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{settings.NEWS_API_BASE_URL}/everything",
                    params={
                        "q": "artificial intelligence OR AI OR machine learning",
                        "sortBy": "publishedAt",
                        "page": page,
                        "pageSize": page_size,
                        "apiKey": settings.NEWS_API_KEY,
                        "language": "en",
                    },
                    timeout=10.0,
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "status": "ok",
                        "totalResults": data.get("totalResults", 0),
                        "articles": data.get("articles", []),
                    }
        except Exception:
            pass

    articles = fetch_rss_feeds()
    if not articles:
        articles = await scrape_web_fallback()

    start = (page - 1) * page_size
    end = start + page_size
    page_articles = articles[start:end]

    return {
        "status": "ok",
        "totalResults": len(articles),
        "articles": page_articles,
    }


@router.get("/trending")
async def get_trending_news(
    authorization: Optional[str] = Header(None, alias="Authorization"),
):
    await get_current_user_id(authorization)

    if settings.NEWS_API_KEY and settings.NEWS_API_KEY != "your-newsapi-key-here":
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{settings.NEWS_API_BASE_URL}/top-headlines",
                    params={
                        "q": "artificial intelligence",
                        "category": "technology",
                        "pageSize": 5,
                        "apiKey": settings.NEWS_API_KEY,
                    },
                    timeout=10.0,
                )
                if response.status_code == 200:
                    data = response.json()
                    return {"status": "ok", "articles": data.get("articles", [])}
        except Exception:
            pass

    articles = fetch_rss_feeds()
    if not articles:
        articles = await scrape_web_fallback()

    return {"status": "ok", "articles": articles[:5]}
