from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base
from app.routers import auth, news

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI News Portal",
    description="Your daily source for the latest AI news",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(news.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "AI News Portal API is running"}
