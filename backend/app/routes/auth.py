import re

from flask import Blueprint, request, jsonify, current_app
from ..models.user import User
import bcrypt
from .. import db
from flask_jwt_extended import create_access_token


EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
MIN_PASSWORD_LENGTH = 8

auth = Blueprint('auth', __name__, url_prefix='/auth')


@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Los campos no pueden estar vacios"}), 400

    if not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "El formato del email no es valido"}), 400

    if len(password) < MIN_PASSWORD_LENGTH:
        return jsonify({"error": f"La contrasena debe tener al menos {MIN_PASSWORD_LENGTH} caracteres"}), 400

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "Este email ya esta registrado"}), 409

    hashedPassword = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(12)).decode("utf-8")

    new_user = User(name=name, email=email, password=hashedPassword)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"succes": "Usuario creado correctamente"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    #Validamos que no haya campos vacios
    if data.get("email") is None or data.get("password") is None:
        return jsonify({"error": "Los campos no pueden estar vacios"}), 400

    # Query para obtener el user de BD como objeto con atributos
    user = User.query.filter_by(email=data.get("email")).first()

    # Buscamos user en BD
    if user is None:
        return jsonify({"error": "Credenciales incorrectas"}), 400
    
    # Password del request encoded
    encodedPassword = data.get("password").encode('utf-8')

    # Comprobamos que coincidan los hashes
    if bcrypt.checkpw(encodedPassword, user.password.encode('utf-8')) is False:
        return jsonify({"error": "Credenciales incorrectas"}), 400
    
    # Creamos un acces token
    expires = current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]
    access_token = create_access_token(identity=str(user.user_id), expires=expires)
    return jsonify(access_token=access_token, user_id =user.user_id, name = user.name), 200