from flask import Blueprint, request, jsonify
from ..models.user import User
import bcrypt
from .. import db
from flask_jwt_extended import create_access_token


auth = Blueprint('auth', __name__,url_prefix='/auth')

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
 
    #Validamos que no haya campos vacios
    if data.get("name") is None or data.get("email") is None or data.get("password") is None:
        return jsonify({"error": "Los campos no pueden estar vacios"}), 400
  
    # Validamos que el email no este registrado en la BD
    if User.query.filter_by(email=data.get("email")).first() is not None:
        return jsonify({"error": "Este email ya esta registrado"}), 409

    # Extraemos el password, hacemos encode y hasheamos y hacemos decode
    hashedPassword = bcrypt.hashpw(data.get("password").encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')

    #Creamos usuario y guardamos en BD
    new_user = User(name=data.get("name"),email=data.get("email"),password=hashedPassword)
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
    access_token = create_access_token(identity=str(user.user_id))
    return jsonify(access_token=access_token, user_id =user.user_id, name = user.name), 200