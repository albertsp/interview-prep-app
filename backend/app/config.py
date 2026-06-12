import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", "1"))
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Orígenes permitidos por CORS, separados por comas.
    # Ejemplo dev: "http://localhost:3000"
    # Ejemplo prod: "https://tu-app.vercel.app,https://*.vercel.app"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "")

    # URL publica del frontend (para futuros enlaces en emails, OG tags, etc.)
    FRONTEND_URL = os.getenv("FRONTEND_URL", "")

    # Modo de la app: "development" | "production" | "test"
    FLASK_ENV = os.getenv("FLASK_ENV", "production")

    @staticmethod
    def parse_cors_origins():
        """Convierte 'a,b,c' en ['a','b','c']. Si esta vacio, devuelve lista vacia."""
        raw = (Config.CORS_ORIGINS or "").strip()
        if not raw:
            return []
        return [origin.strip() for origin in raw.split(",") if origin.strip()]