
from flask_sqlalchemy import SQLAlchemy
from .. import db

class User(db.Model):
    __tablename__ = "user"

    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(250), unique=True) 
    password = db.Column(db.String(250), nullable=False)