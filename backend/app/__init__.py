from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_mail import Mail

# Creamos la clase SQLAlchemy y JWTManager para integrar con Flask
db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()

# Funcion para crear la app
def create_app():
    app = Flask(__name__)               # Instancia inicial para Flask
    app.config.from_object(Config)      # Pasamos parametros de configuracion

    # Corregir URLs detras de proxy (Fly.io terminateda SSL)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    db.init_app(app)                    # Inicializamos app Flask con la extension SQLAlchemy
    jwt.init_app(app)                   # Inicializamos app Flask con extension JTManager
    mail.init_app(app)                  # Inicializamos app Flask con extension Flas_Mail    

    from .models.user import User
    from .models.session import Session
    from .models.question import Question
    from .models.card import Card
    from .models.oauth_account import OAuthAccount
    from .models.passwordReset import PasswordResetToken
    from .routes.auth import auth
    from .routes.oauth import oauth_bp, oauth
    from .routes.stacks import stacks
    from .routes.sessions import sessions
    from .routes.cards import cards
    from .routes.user import user
    from .routes.debug import debug
    from .routes.passwordReset import password_reset

    Migrate(app, db)                    # Habilita migraciones de base de datos con Flask

    # OAuth: registrar providers solo si estan configuradas las credenciales
    has_oauth_provider = (
        (app.config.get("GOOGLE_CLIENT_ID") and app.config.get("GOOGLE_CLIENT_SECRET"))
        or (app.config.get("GITHUB_CLIENT_ID") and app.config.get("GITHUB_CLIENT_SECRET"))
    )

    if has_oauth_provider:
        oauth.init_app(app)

        if app.config.get("GOOGLE_CLIENT_ID") and app.config.get("GOOGLE_CLIENT_SECRET"):
            oauth.register(
                name="google",
                client_id=app.config["GOOGLE_CLIENT_ID"],
                client_secret=app.config["GOOGLE_CLIENT_SECRET"],
                server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
                client_kwargs={"scope": "openid email profile"},
            )

        if app.config.get("GITHUB_CLIENT_ID") and app.config.get("GITHUB_CLIENT_SECRET"):
            oauth.register(
                name="github",
                client_id=app.config["GITHUB_CLIENT_ID"],
                client_secret=app.config["GITHUB_CLIENT_SECRET"],
                access_token_url="https://github.com/login/oauth/access_token",
                authorize_url="https://github.com/login/oauth/authorize",
                api_base_url="https://api.github.com/",
                client_kwargs={"scope": "user:email"},
            )

    
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

    app.register_blueprint(auth)
    app.register_blueprint(oauth_bp)
    app.register_blueprint(stacks)
    app.register_blueprint(sessions)
    app.register_blueprint(cards)
    app.register_blueprint(user)
    app.register_blueprint(debug)
    app.register_blueprint(password_reset)

    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
        max_age=3600,
    )

    return app