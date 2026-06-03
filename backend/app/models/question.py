from .. import db
from .session import Session


class Question(db.Model):
    __tablename__ = "question"

    question_id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.String(500), nullable=True)
    session_id = db.Column(db.Integer,db.ForeignKey(Session.session_id))
    feedback = db.Column(db.String(500), nullable=True)