from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.card import Card
from ..models.session import Session
from ..models.question import Question
from .. import db

# Blueprint para las rutas de cards
cards = Blueprint('cards', __name__, url_prefix='/cards')


# Mapeo de nivel textual a dificultad numerica
LEVEL_TO_DIFFICULTY = {
    "Básico": 1,
    "Intermedio": 2,
    "Avanzado": 3,
}


@cards.route('/', methods=['POST'])
# Protegemos el endpoint con JWT
@jwt_required()
def create_card():
    # Extraemos user_id del token
    user_id = get_jwt_identity()

    # Obtenemos el body de la peticion
    data = request.get_json() or {}

    # Validamos que la sesion pertenece al usuario autenticado
    session = Session.query.filter_by(
        session_id=data.get("session_id"), user_id=user_id
    ).first()
    if not session:
        return jsonify({"msg": "La sesion no existe"}), 404

    # Validamos que la pregunta pertenece a la sesion
    question = Question.query.filter_by(
        question_id=data.get("question_id"), session_id=data.get("session_id")
    ).first()
    if not question:
        return jsonify({"msg": "La pregunta no existe"}), 404

    # Validamos campos obligatorios
    concept = (data.get("concept") or "").strip()
    explanation = (data.get("explanation") or "").strip()
    use_case = (data.get("use_case") or "").strip()
    if not concept or not explanation or not use_case:
        return jsonify({
            "msg": "Los campos concept, explanation y use_case son obligatorios"
        }), 400

    # Truncamos a los limites del modelo (defensa en profundidad)
    if len(concept) > 120:
        concept = concept[:120]
    mnemonic = (data.get("mnemonic") or "").strip()[:200] or None
    tags = data.get("tags")
    if not isinstance(tags, list):
        tags = None

    # Dificultad heredada del nivel de la sesion
    difficulty = LEVEL_TO_DIFFICULTY.get(session.level)

    # Creamos la card en BD
    new_card = Card(
        question_id=data.get("question_id"),
        session_id=data.get("session_id"),
        user_id=user_id,
        concept=concept,
        definition=(data.get("definition") or "").strip() or None,
        explanation=explanation,
        use_case=use_case,
        avoid_when=(data.get("avoid_when") or "").strip() or None,
        mnemonic=mnemonic,
        tags=tags,
        code=(data.get("code") or "").strip() or None,
        code_language=(data.get("code_language") or "javascript").strip() or "javascript",
        difficulty=difficulty,
    )
    db.session.add(new_card)
    db.session.commit()

    # Devolvemos los datos de la card creada
    return jsonify({
        "card_id": new_card.card_id,
        "concept": new_card.concept,
    }), 201
