import secrets
from flask import Blueprint, request, jsonify, current_app
from ..models.user import User
from ..models.passwordReset import PasswordResetToken
import bcrypt
from .. import db, mail
from datetime import datetime, timedelta
from flask_mail import Message

MIN_PASSWORD_LENGTH = 8

password_reset = Blueprint('password_reset', __name__, url_prefix='/password-reset')

@password_reset.route('/resetToken', methods=['POST'])
def resetToken():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "El cuerpo de la peticion debe ser JSON"}), 400

    email = data.get("email") or ""
    if not email:
        return jsonify({"error": "Los campos no pueden estar vacios"}), 400
    
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"error": "Credenciales incorrectas"}), 400

    reset_token =  secrets.token_urlsafe(32)

    new_token = PasswordResetToken(resetToken= reset_token, user_id=user.user_id, expires_at=datetime.utcnow() + timedelta(minutes=30))
    db.session.add(new_token)
    db.session.commit()
    
    msg = Message(
        subject="Recuperación de contraseña",
        recipients=[email],
        body=f"Tu token de recuperación es: {reset_token}"
    )
    try:
        mail.send(msg)
    except Exception as e:
        current_app.logger.warning(f"No se pudo enviar el email a {email}: {e}")

    return  jsonify({"success": "Reset_Token creado y enviado correctamente"}), 201

@password_reset.route('/passwordReset', methods=['PATCH'])
def passwordReset():

    data = request.get_json()
    if data is None:
        return jsonify({"error": "El cuerpo de la peticion debe ser JSON"}), 400
    
    resetToken = data.get("resetToken")  or ""
    password = data.get("password") or ""

    if not resetToken or  not password:
        return jsonify({"error": "Los campos no pueden estar vacios"}), 400
    
    if len(password) < MIN_PASSWORD_LENGTH:
        return jsonify({"error": f"La contrasena debe tener al menos {MIN_PASSWORD_LENGTH} caracteres"}), 400
    
    # validacion del token
    reset_token = PasswordResetToken.query.filter_by(resetToken=resetToken).first()

    if reset_token is None:
        return jsonify({"error": "Credenciales incorrectas"}), 400

    if reset_token.expires_at < datetime.utcnow():
        return jsonify({"error": "El token ha caducado"}), 400
    
    user = User.query.filter_by(user_id=reset_token.user_id).first()
    if user is None:
        return jsonify({"error": "Credenciales incorrectas"}), 400

    hashedPassword = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(12)).decode("utf-8")

    user.password = hashedPassword
    db.session.delete(reset_token)
    db.session.commit()

    return jsonify({"success": "Contraseña Cambiada con Exito"}), 200