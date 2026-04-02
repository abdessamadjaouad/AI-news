# AI News Portal

A modern web application for staying updated with the latest artificial intelligence news. Built with FastAPI and React.

## Features

- Landing page with modern, pleasant UI
- User registration and authentication (JWT)
- Login/logout functionality
- Curated AI news feed with pagination
- Trending news section
- Responsive design with dark theme
- Token refresh for seamless sessions

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy + SQLite
- JWT authentication (access + refresh tokens)
- bcrypt for password hashing
- NewsAPI.org integration (with demo mode)

**Frontend:**
- React 18 + Vite
- React Router 6
- TailwindCSS
- Axios with interceptors
- Lucide React icons

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your NEWS_API_KEY if you have one
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/news/` | Get AI news (requires auth) |
| GET | `/api/news/trending` | Get trending news (requires auth) |
| GET | `/api/health` | Health check |

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
NEWS_API_KEY=your-newsapi-key-here  # Optional, demo mode works without it
```

Get a free API key at https://newsapi.org/

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT and password hashing
│   │   ├── db/            # Database configuration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API endpoints
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── config.py      # Settings
│   │   └── main.py        # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```
