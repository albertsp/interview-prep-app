from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from .routes.main import main
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
    CORS(app)                           # Permite peticiones desde origenes distintos


    app.register_blueprint(main)
    app.register_blueprint(auth)
    app.register_blueprint(stacks)
    app.register_blueprint(sessions)
    app.register_blueprint(cards)

    return app

