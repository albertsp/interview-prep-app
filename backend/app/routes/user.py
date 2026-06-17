from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..constants.gamification import XP_PER_LEVEL, xp_to_next_level
from .. import db

user = Blueprint('user', __name__, url_prefix='/me')


@user.route('/stats', methods=['GET'])
@jwt_required()
def get_my_stats():
    """Devuelve las estadisticas de gamificacion del usuario autenticado."""
    user_id = get_jwt_identity()
    user_row = User.query.filter_by(user_id=user_id).first()
    if user_row is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    total_xp = user_row.total_xp or 0
    level = user_row.level or 1
    next_level_threshold = level * XP_PER_LEVEL
    progress_in_level = total_xp - ((level - 1) * XP_PER_LEVEL)

    return jsonify({
        "total_xp": total_xp,
        "level": level,
        "xp_to_next_level": xp_to_next_level(total_xp),
        "progress_in_level": progress_in_level,
        "xp_per_level": XP_PER_LEVEL,
    })


@user.route('/profile', methods=['GET'])
@jwt_required()
def get_my_profile():
    """Devuelve los datos publicos del perfil del usuario autenticado."""
    user_id = get_jwt_identity()
    user_row = User.query.filter_by(user_id=user_id).first()
    if user_row is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    total_xp = user_row.total_xp or 0
    level = user_row.level or 1
    next_level_threshold = level * XP_PER_LEVEL
    progress_in_level = total_xp - ((level - 1) * XP_PER_LEVEL)

    return jsonify({
        "name": user_row.name,
        "email": user_row.email,
        "total_xp": total_xp,
        "level": level,
        "progress_in_level": max(0, progress_in_level),
        "xp_per_level": XP_PER_LEVEL,
    })


@user.route('/profile', methods=['PATCH'])
@jwt_required()
def update_my_profile():
    """Actualiza los datos del perfil del usuario autenticado."""
    user_id = get_jwt_identity()
    user_row = User.query.filter_by(user_id=user_id).first()
    if user_row is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"msg": "El campo name es obligatorio"}), 400

    user_row.name = name[:80]
    db.session.commit()

    return jsonify({
        "name": user_row.name,
        "email": user_row.email,
    })
