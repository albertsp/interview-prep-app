"use client";

import { useState, useReducer } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { sessionReducer, initialState } from "@/reducers/sessionReducer";
import { createSession, submitAnswer, saveCard } from "@/services/sessionService";

import SessionSetup from "@/components/session/SessionSetup";
import ProgressIndicator from "@/components/session/ProgressIndicator";
import QuestionPhase from "@/components/session/QuestionPhase";
import FeedbackLoading from "@/components/session/FeedbackLoading";
import FeedbackPhase from "@/components/session/FeedbackPhase";
import SessionComplete from "@/components/session/SessionComplete";

export default function SessionPage() {
  // Obtenemos el token JWT del contexto de autenticacion
  const { token } = useAuth();
  const router = useRouter();
  // Reducer que controla todo el flujo de la sesion
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  // Estado para controlar el loading de la creacion de sesion
  const [loading, setLoading] = useState(false);
  // Estado para mostrar errores en modo seleccion
  const [error, setError] = useState(null);

  // --- HANDLERS QUE ORQUESTAN EL FLUJO ---

  // Crea la sesion en el backend (modo seleccion) y la inicializa en el reducer
  const handleCreateSession = async (select) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createSession(token, select);
      dispatch({ type: "INIT_SESSION", payload: data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Envia la respuesta del usuario al backend y guarda el feedback de la IA
  const handleSubmitAnswer = async () => {
    dispatch({ type: "ANSWER_SUBMITTED" });

    const question = state.questions[state.currentQuestionIndex];

    try {
      const data = await submitAnswer(
        token,
        state.session_id,
        question.question_id,
        state.currentAnswer
      );
      dispatch({ type: "FEEDBACK_RECEIVED", payload: data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  // Guarda la card de estudio en el backend y avanza a la siguiente pregunta
  const handleSaveCard = async () => {
    const question = state.questions[state.currentQuestionIndex];

    try {
      await saveCard(token, {
        question_id: question.question_id,
        session_id: state.session_id,
        concept: state.card.concept,
        explanation: state.card.explanation,
        use_case: state.card.use_case,
      });
    } catch (err) {
      console.error("Error al guardar la card:", err.message);
    }

    dispatch({ type: "CARD_SAVED" });
  };

  // --- RENDERIZADO ---

  // Modo seleccion: no hay sesion activa, mostramos el setup
  if (!state.session_id) {
    return (
      <SessionSetup
        loading={loading}
        error={error}
        onSubmit={handleCreateSession}
      />
    );
  }

  // Modo sesion activa: renderizado condicional segun la fase
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <ProgressIndicator
          currentIndex={state.currentQuestionIndex}
          total={state.questions.length}
          stack={state.stack}
          level={state.level}
        />

        <AnimatePresence mode="wait">
          {/* Fase: respondiendo la pregunta */}
          {state.currentPhase === "answering" && (
            <QuestionPhase
              question={state.questions[state.currentQuestionIndex].question}
              answer={state.currentAnswer}
              error={state.error}
              onAnswerChange={(value) =>
                dispatch({ type: "ANSWER_CHANGED", payload: value })
              }
              onSubmit={handleSubmitAnswer}
            />
          )}

          {/* Fase: esperando el feedback de la IA */}
          {state.currentPhase === "loading_feedback" && <FeedbackLoading />}

          {/* Fase: feedback recibido, mostrar card y acciones */}
          {state.currentPhase === "waiting_action" && (
            <FeedbackPhase
              feedback={state.feedback}
              card={state.card}
              onEdit={() => dispatch({ type: "EDIT_ANSWER" })}
              onDiscard={() => dispatch({ type: "CARD_DISCARDED" })}
              onSave={handleSaveCard}
            />
          )}

          {/* Fase: sesion completada */}
          {state.currentPhase === "complete" && (
            <SessionComplete
              totalQuestions={state.questions.length}
              stack={state.stack}
              onDashboard={() => router.push("/dashboard")}
              onNewSession={() => dispatch({ type: "RESET_SESSION" })}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
