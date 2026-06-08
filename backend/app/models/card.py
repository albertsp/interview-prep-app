from .. import db
from .user import User
from .session import Session
from .question import Question
from datetime import datetime


class Card(db.Model):
    __tablename__ = "card"

    # Identificador unico de la card
    card_id = db.Column(db.Integer, primary_key=True)
    # FK a la pregunta de la que se genero esta card
    question_id = db.Column(db.Integer, db.ForeignKey(Question.question_id))
    # FK a la sesion a la que pertenece
    session_id = db.Column(db.Integer, db.ForeignKey(Session.session_id))
    # FK al usuario propietario
    user_id = db.Column(db.Integer, db.ForeignKey(User.user_id))
    # Concepto clave extraido de la respuesta
    concept = db.Column(db.String(250), nullable=False)
    # Explicacion detallada del concepto
    explanation = db.Column(db.Text(), nullable=False)
    # Caso de uso practico del concepto
    use_case = db.Column(db.Text(), nullable=False)
    # Snippet de codigo de ejemplo
    code = db.Column(db.Text(), nullable=True)
    # Lenguaje del snippet de codigo
    code_language = db.Column(db.String(50), nullable=True, default="javascript")
    # Fecha de creacion de la card
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
