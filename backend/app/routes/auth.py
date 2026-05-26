from flask import Blueprint, request, jsonify
from ..models.user import User
import bcrypt
from .. import db


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

    # Extraemos el password, hacemos encode y hasheamos
    hashedPassword = bcrypt.hashpw(data.get("password").encode('utf-8'), bcrypt.gensalt(12))

    #Creamos usuario y guardamos en BD
    new_user = User(name=data.get("name"),email=data.get("email"),password=hashedPassword)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"succes": "Usuario creado correctamente"}), 201