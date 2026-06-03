from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..constants.stacks import VALID_LEVELS,VALID_STACKS
from ..models.session import Session
from ..models.question import Question
from .. import db
from ..services.ai_service import generate_questions

sessions = Blueprint('sessions',__name__,url_prefix='/sessions')


@sessions.route('/', methods=['POST'])
# Protegemos el endpoint con JWT
@jwt_required()                         
def create_session():

    # Extraemos user_id del token
    user_id = get_jwt_identity()        

    # Obtenemos el body y accedemos a los campos
    data = request.get_json()
    stack = data.get("stack")
    level = data.get("level")

    # Validamos que el stack y el nivel pertenece a la lista permitida
    if stack not in VALID_STACKS or level not in VALID_LEVELS:
        return jsonify({"Error":"El stack seleccionado o el nivel no estan permitidos"}), 400
    
    # Creamos sesion en BD
    new_session = Session(user_id=user_id,stack=stack,level=level)
    db.session.add(new_session)
    db.session.commit()
    
    # Generamos preguntas
    questions = generate_questions(stack,level)

    # Guardamos cada pregunta como registro Question en BD de la session actual
    for question in questions:
        db.session.add(Question(question=question,session_id=new_session.session_id))
    
    db.session.commit()
    
    # Devolvemos la sesion con las preguntas
    return jsonify({
                    "session_id": new_session.session_id,
                    "stack": new_session.stack,
                    "level": new_session.level,
                    "questions": questions
                    }), 201


@sessions.route('/<int:session_id>/questions/<int:question_id>', methods=['PATCH'])
def answer_question(session_id, question_id):
    
    return jsonify()