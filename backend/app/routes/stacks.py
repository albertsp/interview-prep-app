from flask import Blueprint, jsonify

stacks = Blueprint('stacks', __name__,url_prefix='/stacks')

@stacks.route('/', methods=['GET'])
def get_stacks():
    return jsonify({
  "rol": {
    "Frontend": ["HTML/CSS", "JavaScript", "React"],
    "Backend": ["Python", "SQL"]
  },

  "level": ["Básico", "Intermedio", "Avanzado"]
})