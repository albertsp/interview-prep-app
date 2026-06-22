from .. import db
from .user import User

class PasswordResetToken(db.Model):
    __tablename__ = "resetToken"

    id = db.Column(db.Integer, primary_key=True)
    resetToken = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
