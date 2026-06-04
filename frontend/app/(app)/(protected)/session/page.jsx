"use client";

import { useState, useReducer } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StackSelector from "@/components/StackSelector";
import MarkdownContent from "@/components/MarkdownContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { sessionReducer, initialState } from "@/reducers/sessionReducer";
import { cn } from "@/lib/utils";
import {
  Send,
  Save,
  Trash2,
  Pencil,
  CheckCircle,
  Home,
  RotateCcw,
  Sparkles,
  Lightbulb,
} from "lucide-react";

export default function SessionPage() {
  // Estado para controlar el loading de la creacion de sesion
  const [loading, setLoading] = useState(false);
  // Estado para mostrar errores en modo seleccion
  const [error, setError] = useState(null);
  // Obtenemos el token JWT del contexto de autenticacion
  const { token } = useAuth();
  const router = useRouter();
  // Reducer que controla todo el flujo de la sesion
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // --- FETCHS AL BACKEND ---

  // Crea la sesion en el backend (modo seleccion)
  const handleSubmit = async (select) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ stack: select.stack, level: select.level }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Error || data.msg || "Error al crear la sesion");
      }

      // Inicializa el reducer con los datos de la sesion
      dispatch({ type: "INIT_SESSION", payload: data });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Envia la respuesta del usuario y obtiene feedback de la IA
  const handleAnswer = async () => {
    dispatch({ type: "ANSWER_SUBMITTED" });

    const question = state.questions[state.currentQuestionIndex];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/${state.session_id}/questions/${question.question_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answer: state.currentAnswer }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al enviar la respuesta");
      }

      // Guardamos el feedback y la card devueltos por la IA
      dispatch({ type: "FEEDBACK_RECEIVED", payload: data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  // Guarda la card en el backend y avanza a la siguiente pregunta
  const handleSaveCard = async () => {
    const question = state.questions[state.currentQuestionIndex];

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_id: question.question_id,
          session_id: state.session_id,
          concept: state.card.concept,
          explanation: state.card.explanation,
          use_case: state.card.use_case,
        }),
      });
    } catch (error) {
      console.error("Error al guardar la card:", error.message);
    }

    dispatch({ type: "CARD_SAVED" });
  };

  // --- RENDERIZADO ---

  // Mientras se crea la sesion, mostramos un estado de carga con animacion
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <svg
              className="animate-spin h-10 w-10 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-xl">Creando sesion...</p>
        </motion.div>
      </div>
    );
  }

  // Modo seleccion: no hay sesion activa, mostramos el StackSelector
  if (!state.session_id) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Nueva sesion</h1>
            <p className="text-muted-foreground mt-1">
              Configura tu entrevista personalizada en tres pasos
            </p>
          </div>
          <StackSelector onSubmit={handleSubmit} />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-center mt-8"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  // Pregunta actual segun el indice
  const currentQuestion = state.questions[state.currentQuestionIndex];

  // Modo sesion activa: renderizado condicional segun la fase
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* ---- Indicador de progreso de preguntas ---- */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-base text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">
              Pregunta {state.currentQuestionIndex + 1}
            </span>
            <span>de</span>
            <span className="font-semibold">{state.questions.length}</span>
          </div>

          {/* Dots de progreso al estilo StackSelector */}
          <div className="flex items-center justify-center">
            {state.questions.map((_, idx) => (
              <div key={idx} className="flex items-center">
                {idx > 0 && (
                  <div
                    className={cn(
                      "w-16 h-1 mx-3 rounded-full transition-colors duration-500",
                      idx <= state.currentQuestionIndex ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center size-10 rounded-full text-sm font-bold transition-all duration-300",
                    idx < state.currentQuestionIndex && "bg-primary text-primary-foreground",
                    idx === state.currentQuestionIndex && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    idx > state.currentQuestionIndex && "bg-muted text-muted-foreground"
                  )}
                >
                  {idx < state.currentQuestionIndex ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stack + level */}
          <p className="text-center text-sm text-muted-foreground mt-3">
            {state.stack} · {state.level}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ---- Fase: respondiendo la pregunta ---- */}
          {state.currentPhase === "answering" && (
            <motion.div
              key="answering"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Card con la pregunta */}
              <Card className="mb-6">
                <CardContent className="p-8 md:p-10">
                  <MarkdownContent text={currentQuestion.question} className="text-xl leading-relaxed" />
                </CardContent>
              </Card>

              {/* Textarea para la respuesta */}
              <textarea
                className={cn(
                  "w-full min-h-[160px] rounded-xl border border-input bg-background px-5 py-4 text-base resize-y transition-colors outline-none",
                  "placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  "disabled:pointer-events-none disabled:opacity-50"
                )}
                placeholder="Escribe tu respuesta aqui..."
                value={state.currentAnswer}
                onChange={(e) =>
                  dispatch({ type: "ANSWER_CHANGED", payload: e.target.value })
                }
              />

              {state.error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-destructive text-base mt-3"
                >
                  {state.error}
                </motion.p>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleAnswer}
                  disabled={!state.currentAnswer.trim()}
                  size="lg"
                  className="gap-2 px-10 text-base"
                >
                  Enviar respuesta
                  <Send className="size-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ---- Fase: esperando el feedback de la IA ---- */}
          {state.currentPhase === "loading_feedback" && (
            <motion.div
              key="loading_feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="relative inline-block mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="size-20 rounded-full border-4 border-primary/20 border-t-primary"
                />
                <Sparkles className="absolute inset-0 m-auto size-7 text-primary" />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground"
              >
                La IA esta evaluando tu respuesta...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground/60 mt-2"
              >
                Esto puede tardar unos segundos
              </motion.p>
            </motion.div>
          )}

          {/* ---- Fase: feedback recibido, mostrar card y acciones ---- */}
          {state.currentPhase === "waiting_action" && (
            <motion.div
              key="waiting_action"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Card de feedback */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="size-5 text-primary" />
                      Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <MarkdownContent text={state.feedback} className="text-base text-muted-foreground" />
                </CardContent>
              </Card>

              {/* Card generada por la IA */}
              {state.card && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Card className="mb-6 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="size-5 text-primary" />
                        Card de estudio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pb-6">
                      <div>
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Concepto
                        </span>
                        <p className="text-base font-medium mt-1">{state.card.concept}</p>
                      </div>

                      <div>
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Explicacion
                        </span>
                        <p className="text-base text-muted-foreground mt-1 leading-relaxed">
                          {state.card.explanation}
                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Caso de uso
                        </span>
                        <p className="text-base text-muted-foreground mt-1 leading-relaxed">
                          {state.card.use_case}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Botones de accion sobre la card */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => dispatch({ type: "EDIT_ANSWER" })}
                  className="gap-2"
                >
                  <Pencil className="size-5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => dispatch({ type: "CARD_DISCARDED" })}
                  className="gap-2"
                >
                  <Trash2 className="size-5" />
                  Descartar
                </Button>
                <Button onClick={handleSaveCard} size="lg" className="gap-2">
                  <Save className="size-5" />
                  Guardar card
                </Button>
              </div>
            </motion.div>
          )}

          {/* ---- Fase: sesion completada ---- */}
          {state.currentPhase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8 md:p-10 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="mb-6 size-20 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <CheckCircle className="size-10 text-primary" />
                  </motion.div>

                    <h2 className="text-3xl font-bold tracking-tight mb-2">
                      Sesion completada
                    </h2>
                    <p className="text-base text-muted-foreground mb-2">
                      Has completado las {state.questions.length} preguntas de{" "}
                      <span className="font-medium text-foreground">{state.stack}</span>.
                    </p>
                    <p className="text-base text-muted-foreground mb-8">
                      Revisa las cards guardadas en tu dashboard para repasar los conceptos clave.
                    </p>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/dashboard")}
                      className="gap-2"
                    >
                      <Home className="size-5" />
                      Ir al dashboard
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => dispatch({ type: "RESET_SESSION" })}
                      className="gap-2"
                    >
                      <RotateCcw className="size-5" />
                      Nueva sesion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
