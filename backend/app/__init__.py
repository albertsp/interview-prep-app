from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager


# Creamos la clase SQLAlchemy y JWTManager para integrar con Flask
db = SQLAlchemy()
jwt = JWTManager()

# Funcion para crear la app
def create_app():
    app = Flask(__name__)               # Instancia inicial para Flask
    app.config.from_object(Config)      # Pasamos parametros de configuracion

    db.init_app(app)                    # Inicializamos app Flask con la extension SQLAlchemy
    jwt.init_app(app)                   # Inicializamos app Flask con extension JTManager

    from .models.user import User
    from .models.session import Session
    from .models.question import Question
    from .models.card import Card
    from .routes.auth import auth
    from .routes.stacks import stacks
    from .routes.sessions import sessions
    from .routes.cards import cards
    
    Migrate(app, db)                    # Habilita migraciones de base de datos con Flask


    
    # CORS: orígenes permitidos según entorno.
    # En dev, si CORS_ORIGINS está vacío, usamos localhost:3000 como fallback seguro.
    # En producción, NO hay fallback: si no defines CORS_ORIGINS, la app falla al arrancar.
    if Config.FLASK_ENV == "development" and not Config.parse_cors_origins():
        allowed_origins = ["http://localhost:3000"]
    else:
        allowed_origins = Config.parse_cors_origins()

    if not allowed_origins:
        raise RuntimeError(
            "CORS_ORIGINS es obligatorio en producción. "
            "Define la variable en tu .env o en los secrets de Fly.io."
        )

    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        max_age=3600,
    )


    app.register_blueprint(auth)
    app.register_blueprint(stacks)
    app.register_blueprint(sessions)
    app.register_blueprint(cards)

    return app

