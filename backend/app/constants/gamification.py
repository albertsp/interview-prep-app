XP_PER_LEVEL = 500

XP_PER_RESULT = {
    "CORRECT": 100,
    "PARTIALLY_CORRECT": 50,
    "INCORRECT": 10,
}

XP_COMPLETION_BONUS = 50


def compute_level(total_xp):
    """Nivel = floor(total_xp / XP_PER_LEVEL) + 1. Nivel 1 desde 0 XP."""
    return (total_xp // XP_PER_LEVEL) + 1


def xp_to_next_level(total_xp):
    """XP que faltan para subir al siguiente nivel."""
    current_level = compute_level(total_xp)
    next_level_threshold = current_level * XP_PER_LEVEL
    return max(0, next_level_threshold - total_xp)
