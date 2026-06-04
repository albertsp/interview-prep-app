from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.card import Card
from ..models.session import Session
from ..models.question import Question
from .. import db

# Blueprint para las rutas de cards
cards = Blueprint('cards', __name__, url_prefix='/cards')


@cards.route('/', methods=['POST'])
# Protegemos el endpoint con JWT
@jwt_required()
def create_card():
    # Extraemos user_id del token
    user_id = get_jwt_identity()

    # Obtenemos el body de la peticion
    data = request.get_json()

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

    # Creamos la card en BD
    new_card = Card(
        question_id=data.get("question_id"),
        session_id=data.get("session_id"),
        user_id=user_id,
        concept=data.get("concept"),
        explanation=data.get("explanation"),
        use_case=data.get("use_case"),
    )
    db.session.add(new_card)
    db.session.commit()

    # Devolvemos los datos de la card creada
    return jsonify({
        "card_id": new_card.card_id,
        "concept": new_card.concept,
    }), 201
