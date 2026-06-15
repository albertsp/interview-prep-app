from flask import Blueprint, jsonify
from .. import db
from sqlalchemy import text

debug = Blueprint('debug', __name__, url_prefix='/debug')


@debug.route('/db', methods=['GET'])
def db_status():
    try:
        result = db.session.execute(text(
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
        ))
        tables = [row[0] for row in result]

        user_count = db.session.execute(text("SELECT count(*) FROM \"user\"")).scalar()
        session_count = db.session.execute(text("SELECT count(*) FROM session")).scalar()
        card_count = db.session.execute(text("SELECT count(*) FROM card")).scalar()

        return jsonify({
            "db": "connected",
            "tables": tables,
            "counts": {
                "user": user_count,
                "session": session_count,
                "card": card_count,
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
