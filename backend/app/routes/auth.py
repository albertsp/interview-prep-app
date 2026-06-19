import re

from flask import Blueprint, request, jsonify, current_app
from ..models.user import User
import bcrypt
from .. import db
from flask_jwt_extended import create_access_token, set_access_cookies, unset_access_cookies


EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
MIN_PASSWORD_LENGTH = 8

auth = Blueprint('auth', __name__, url_prefix='/auth')


@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "El cuerpo de la peticion debe ser JSON"}), 400

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

    return jsonify({"success": "Usuario creado correctamente"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "El cuerpo de la peticion debe ser JSON"}), 400

    email = data.get("email") or ""
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Los campos no pueden estar vacios"}), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Credenciales incorrectas"}), 400

    if user.password is None:
        return jsonify({"error": "Credenciales incorrectas"}), 400

    encodedPassword = password.encode('utf-8')

    if bcrypt.checkpw(encodedPassword, user.password.encode('utf-8')) is False:
        return jsonify({"error": "Credenciales incorrectas"}), 400

    expires_delta = current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]
    access_token = create_access_token(identity=str(user.user_id), expires_delta=expires_delta)

    response = jsonify({
        "user_id": user.user_id,
        "name": user.name,
        "token": access_token,
    })
    set_access_cookies(response, access_token)
    return response, 200


@auth.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "Sesion cerrada correctamente"})
    unset_access_cookies(response)
    return response, 200