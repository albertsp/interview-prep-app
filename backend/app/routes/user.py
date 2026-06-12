from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..constants.gamification import XP_PER_LEVEL, xp_to_next_level

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
