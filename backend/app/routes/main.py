from app.services.ai_service import generate_questions
from flask import jsonify, Blueprint

main = Blueprint('main', __name__)

@main.route('/test-ai')
def test_ai():
    result = generate_questions('JavaScript', 'Básico')
    return jsonify({"result": result})