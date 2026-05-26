from flask import Blueprint, jsonify

main = Blueprint('main', __name__)

@main.route('/')
def get_health():
    return jsonify({"status": "ok"})