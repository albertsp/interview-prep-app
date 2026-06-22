import os
from datetime import timedelta
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(usecwd=True))


def _get_database_url():
    url = os.getenv("DATABASE_URL")
    if url and url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


class Config:
    SQLALCHEMY_DATABASE_URI = _get_database_url()
    SECRET_KEY = os.getenv("SECRET_KEY", os.getenv("JWT_SECRET_KEY", "dev-secret-key"))

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY es obligatorio. Definir en .env o variables de entorno.")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", "1"))
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT en cookies httpOnly para proteccion contra XSS
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = os.getenv("FLASK_ENV") == "production"
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_COOKIE_SAMESITE = "None" if os.getenv("FLASK_ENV") == "production" else "Lax"

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

    # Orígenes permitidos por CORS, separados por comas.
    # Ejemplo dev: "http://localhost:3000"
    # Ejemplo prod: "https://tu-app.vercel.app,https://*.vercel.app"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "")

    # URL publica del frontend (para redirigir tras OAuth)
    FRONTEND_URL = os.getenv("FRONTEND_URL", "")

    # Modo de la app: "development" | "production" | "test"
    FLASK_ENV = os.getenv("FLASK_ENV", "production")

    # En produccion detras de proxy, forzar HTTPS en las URLs generadas
    PREFERRED_URL_SCHEME = "https" if FLASK_ENV == "production" else "http"

    @staticmethod
    def parse_cors_origins():
        """Convierte 'a,b,c' en ['a','b','c']. Si esta vacio, devuelve lista vacia."""
        raw = (Config.CORS_ORIGINS or "").strip()
        if not raw:
            return []
        return [origin.strip() for origin in raw.split(",") if origin.strip()]
    
    # Flask-Mail
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_USERNAME")