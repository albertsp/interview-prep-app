from flask import Blueprint, jsonify
from ..constants.stacks import ROLES, VALID_LEVELS

stacks = Blueprint('stacks', __name__, url_prefix='/stacks')


@stacks.route('/', methods=['GET'])
def get_stacks():
    return jsonify({
        "rol": ROLES,
        "level": VALID_LEVELS,
    })
