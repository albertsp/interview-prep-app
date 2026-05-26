from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from .routes.main import main

# Creamos la clase SQLAlchemy para integrar con Flask
db = SQLAlchemy()

# Funcion para crear la app
def create_app():
    app = Flask(__name__)               # Instancia inicial para Flask
    app.config.from_object(Config)      # Pasamos parametros de configuracion

    db.init_app(app)                    # Inicializamos app Flask con la extension SQLAlchemy

    from .models.user import User


    Migrate(app, db)                    # Habilita migraciones de base de datos con Flask
    CORS(app)                           # Permite peticiones desde origenes distintos

    app.register_blueprint(main)
    return app

