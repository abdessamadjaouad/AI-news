import feedparser
import httpx
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from typing import Optional
import re
import hashlib

RSS_FEEDS = [
    {
        "url": "https://feeds.feedburner.com/TechCrunch/artificial-intelligence",
        "name": "TechCrunch AI",
    },
    {
        "url": "https://www.wired.com/feed/tag/ai/latest/rss",
        "name": "Wired AI",
    },
    {
        "url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
        "name": "The Verge AI",
    },
    {
        "url": "https://arstechnica.com/tag/artificial-intelligence/feed/",
        "name": "Ars Technica AI",
    },
    {
        "url": "https://venturebeat.com/category/ai/feed/",
        "name": "VentureBeat AI",
    },
    {
        "url": "https://www.technologyreview.com/topic/artificial-intelligence/feed",
        "name": "MIT Tech Review AI",
    },
    {
        "url": "https://www.zdnet.com/topic/artificial-intelligence/rss.xml",
        "name": "ZDNet AI",
    },
    {
        "url": "https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml",
        "name": "ScienceDaily AI",
    },
]

AI_KEYWORDS = [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "neural network",
    "llm",
    "large language model",
    "gpt",
    "claude",
    "gemini",
    "mistral",
    "generative ai",
    "ai model",
    "ai system",
    "ai tool",
    "ai agent",
    "chatbot",
    "transformer model",
    "training data",
    "ai safety",
    "agi",
    "artificial general intelligence",
    "robot learning",
    "computer vision",
    "nlp",
    "natural language processing",
    "openai",
    "anthropic",
    "deepmind",
    "meta ai",
    "google ai",
    "ai regulation",
    "ai policy",
    "ai ethics",
    "ai research",
    "autonomous",
    "self-driving",
    "ai chip",
    "gpu computing",
    "ai startup",
    "ai funding",
    "ai industry",
    "ai development",
    "prompt engineering",
    "fine-tuning",
    "reinforcement learning",
    "diffusion model",
    "stable diffusion",
    "dall-e",
    "midjourney",
    "ai coding",
    "code generation",
    "ai assistant",
    "copilot",
]


def _is_ai_relevant(title: str, description: str = "") -> bool:
    text = (title + " " + description).lower()
    score = 0
    for keyword in AI_KEYWORDS:
        if keyword in text:
            score += 1
            if len(keyword.split()) > 1:
                score += 1
    return score >= 1


FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&q=80",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
]


def _get_fallback_image(idx: int) -> str:
    return FALLBACK_IMAGES[idx % len(FALLBACK_IMAGES)]


def _extract_image(entry) -> Optional[str]:
    if hasattr(entry, "media_content") and entry.media_content:
        for media in entry.media_content:
            if media.get("medium") == "image" and media.get("url"):
                return media["url"]
    if hasattr(entry, "media_thumbnail") and entry.media_thumbnail:
        return entry.media_thumbnail[0].get("url", "")
    for link in entry.get("links", []):
        if link.get("type", "").startswith("image"):
            return link.get("href", "")
    content = entry.get("content", [{}])[0] if entry.get("content") else {}
    html = content.get("value", "") or entry.get("summary", "")
    if html:
        soup = BeautifulSoup(html, "html.parser")
        img = soup.find("img")
        if img and img.get("src"):
            return img["src"]
    return None


def _clean_description(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > 500:
        text = text[:497] + "..."
    return text


def _parse_date(entry) -> str:
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        try:
            dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
            return dt.isoformat()
        except (ValueError, TypeError):
            pass
    if hasattr(entry, "updated_parsed") and entry.updated_parsed:
        try:
            dt = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc)
            return dt.isoformat()
        except (ValueError, TypeError):
            pass
    return datetime.now(timezone.utc).isoformat()


def fetch_rss_feeds() -> list[dict]:
    articles = []
    seen_urls = set()

    for feed_info in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_info["url"])
            if feed.bozo and not feed.entries:
                continue
            for entry in feed.entries[:20]:
                url = entry.get("link", "")
                if not url or url in seen_urls:
                    continue

                title = entry.get("title", "").strip()
                if not title or len(title) < 10:
                    continue

                desc = _clean_description(
                    entry.get("summary", "")
                    or (
                        entry.get("content", [{}])[0].get("value", "")
                        if entry.get("content")
                        else ""
                    )
                )

                if not _is_ai_relevant(title, desc):
                    continue

                seen_urls.add(url)

                image = _extract_image(entry)

                article = {
                    "title": title,
                    "description": desc,
                    "url": url,
                    "urlToImage": image or _get_fallback_image(len(articles)),
                    "publishedAt": _parse_date(entry),
                    "source": {"name": feed_info["name"]},
                    "author": entry.get("author", ""),
                }
                articles.append(article)
        except Exception:
            continue

    articles.sort(key=lambda a: a["publishedAt"], reverse=True)
    return articles


async def scrape_web_fallback() -> list[dict]:
    articles = []
    urls_to_scrape = [
        {
            "url": "https://techcrunch.com/category/artificial-intelligence/",
            "name": "TechCrunch",
        },
        {
            "url": "https://www.wired.com/tag/artificial-intelligence/",
            "name": "Wired",
        },
    ]

    async with httpx.AsyncClient(
        headers={"User-Agent": "Mozilla/5.0 (compatible; AINewsBot/1.0)"},
        timeout=15.0,
        follow_redirects=True,
    ) as client:
        for idx, source in enumerate(urls_to_scrape):
            try:
                resp = await client.get(source["url"])
                if resp.status_code != 200:
                    continue
                soup = BeautifulSoup(resp.text, "html.parser")
                for a_tag in soup.find_all("a", href=True):
                    href = a_tag["href"]
                    heading = a_tag.find(["h2", "h3", "h4"]) or a_tag
                    title = heading.get_text(strip=True)
                    if not title or len(title) < 15:
                        continue
                    if not _is_ai_relevant(title):
                        continue
                    if href.startswith("http") or href.startswith("/"):
                        full_url = (
                            href
                            if href.startswith("http")
                            else f"https://techcrunch.com{href}"
                        )
                        articles.append(
                            {
                                "title": title,
                                "description": "",
                                "url": full_url,
                                "urlToImage": _get_fallback_image(len(articles)),
                                "publishedAt": datetime.now(timezone.utc).isoformat(),
                                "source": {"name": source["name"]},
                                "author": "",
                            }
                        )
            except Exception:
                continue

    return articles[:20]
