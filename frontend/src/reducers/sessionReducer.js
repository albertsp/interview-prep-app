// Estado inicial del flujo de sesion
export const initialState = {
  // Datos de la sesion
  session_id: null,
  stack: null,
  level: null,
  // Lista de preguntas con su respuesta y feedback
  questions: [],
  // Indice de la pregunta actual
  currentQuestionIndex: 0,
  // Respuesta actual que escribe el usuario en el textarea
  currentAnswer: "",
  // Fase actual del flujo de entrevista
  currentPhase: "answering", // "answering" | "loading_feedback" | "waiting_action" | "complete"
  // Resultado devuelto por la IA: CORRECT | PARTIALLY_CORRECT | INCORRECT
  result: null,
  // Feedback devuelto por la IA para la respuesta actual
  feedback: null,
  // Card generada por la IA para la pregunta actual (editable por el usuario)
  card: null,
  // Snapshot de la card original de la IA, para detectar si el usuario la edito
  originalCard: null,
  // XP ganado en esta sesion (lo devuelve POST /sessions/<id>/complete)
  sessionXpEarned: 0,
  // Total XP del usuario tras esta sesion
  sessionTotalXp: 0,
  // Nivel del usuario tras esta sesion
  sessionLevel: 1,
  // XP que faltan para el siguiente nivel tras esta sesion
  sessionXpToNextLevel: 500,
  // Si se aplico el bonus por completar todas las preguntas
  sessionBonusApplied: false,
  // Si el /complete ya se llamo y devolvio datos
  sessionCompleteLoaded: false,
  // Mensaje de error para mostrar al usuario
  error: null,
};

// Reducer que controla todo el flujo de la sesion de entrevista
export function sessionReducer(state, action) {
  switch (action.type) {
    // Inicializa la sesion con los datos devueltos por POST /sessions/
    case "INIT_SESSION": {
      const { session_id, stack, level, questions } = action.payload;
      // Añadimos campos answer y feedback a cada pregunta para seguimiento
      const initializedQuestions = questions.map((q) => ({
        ...q,
        answer: "",
        feedback: null,
      }));
      return {
        ...state,
        session_id,
        stack,
        level,
        questions: initializedQuestions,
        currentQuestionIndex: 0,
        currentAnswer: "",
        currentPhase: "answering",
        result: null,
        feedback: null,
        card: null,
        originalCard: null,
        sessionXpEarned: 0,
        sessionTotalXp: 0,
        sessionLevel: 1,
        sessionXpToNextLevel: 500,
        sessionBonusApplied: false,
        sessionCompleteLoaded: false,
        error: null,
      };
    }

    // El usuario escribe en el textarea de respuesta
    case "ANSWER_CHANGED":
      return { ...state, currentAnswer: action.payload, error: null };

    // El usuario pulsa el boton de enviar respuesta
    case "ANSWER_SUBMITTED": {
      // Guardamos la respuesta del usuario en el array de preguntas
      const updatedQuestions = [...state.questions];
      updatedQuestions[state.currentQuestionIndex] = {
        ...updatedQuestions[state.currentQuestionIndex],
        answer: state.currentAnswer,
      };
      return {
        ...state,
        questions: updatedQuestions,
        currentPhase: "loading_feedback",
        error: null,
      };
    }

    // La IA ha devuelto el feedback y la card
    case "FEEDBACK_RECEIVED": {
      // Guardamos el feedback en el array de preguntas
      const updatedQuestions = [...state.questions];
      updatedQuestions[state.currentQuestionIndex] = {
        ...updatedQuestions[state.currentQuestionIndex],
        feedback: action.payload.feedback,
        result: action.payload.result,
      };
      return {
        ...state,
        questions: updatedQuestions,
        result: action.payload.result,
        feedback: action.payload.feedback,
        card: action.payload.card,
        // originalCard se congela aqui como snapshot inmutable para detectar ediciones
        originalCard: action.payload.card,
        currentPhase: "waiting_action",
      };
    }

    // El usuario edita los campos de la card en el editor inline
    case "UPDATE_CARD":
      return {
        ...state,
        card: { ...state.card, ...action.payload },
      };

    // Avanza a la siguiente pregunta o termina la sesion si no hay mas
    case "NEXT_QUESTION": {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, currentPhase: "complete", card: null, feedback: null };
      }
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        currentAnswer: "",
        feedback: null,
        card: null,
        currentPhase: "answering",
        error: null,
      };
    }

    // El usuario guarda la card en el backend
    case "CARD_SAVED": {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, card: null, currentPhase: "complete" };
      }
      return {
        ...state,
        card: null,
        currentQuestionIndex: nextIndex,
        currentAnswer: "",
        feedback: null,
        currentPhase: "answering",
        error: null,
      };
    }

    // El usuario descarta la card sin guardarla
    case "CARD_DISCARDED": {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, card: null, currentPhase: "complete" };
      }
      return {
        ...state,
        card: null,
        currentQuestionIndex: nextIndex,
        currentAnswer: "",
        feedback: null,
        currentPhase: "answering",
        error: null,
      };
    }

    // Finaliza la sesion manualmente
    case "SESSION_ENDED":
      return { ...state, currentPhase: "complete", card: null, feedback: null };

    // Guarda el resultado de POST /sessions/<id>/complete
    case "SESSION_COMPLETED": {
      const { xp_earned, total_xp, level, xp_to_next_level, bonus_applied } = action.payload;
      return {
        ...state,
        currentPhase: "complete",
        card: null,
        feedback: null,
        sessionXpEarned: xp_earned ?? 0,
        sessionTotalXp: total_xp ?? 0,
        sessionLevel: level ?? 1,
        sessionXpToNextLevel: xp_to_next_level ?? 500,
        sessionBonusApplied: !!bonus_applied,
        sessionCompleteLoaded: true,
      };
    }

    // Guarda un mensaje de error para mostrar al usuario
    case "SET_ERROR":
      return { ...state, error: action.payload, currentPhase: "answering" };

    // Reinicia el estado para empezar una nueva sesion
    case "RESET_SESSION":
      return { ...initialState };

    default:
      return state;
  }
}
