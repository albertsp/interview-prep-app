"use client"

import { motion } from "framer-motion"

const FEATURES = [
  {
    icon: "👤",
    title: "Tu cuenta, tu progreso",
    description: "Regístrate e inicia sesión para tener todo tu historial guardado y acceder desde cualquier dispositivo.",
  },
  {
    icon: "⚡",
    title: "Examen de 5 preguntas",
    description: "Genera un mini examen personalizado según tu rol, tecnología y nivel. La IA crea las preguntas por ti.",
  },
  {
    icon: "🃏",
    title: "Cards con Q&A",
    description: "Cada pregunta viene con su respuesta explicada en una card. Ideal para repasar a tu ritmo.",
  },
  {
    icon: "🗂️",
    title: "Historial guardado",
    description: "Todas tus cards quedan guardadas en tu cuenta. Vuelve a practicar cuando quieras.",
  },
];

export default function Features() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-200px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full px-6 py-16 bg-white"
    >

      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
          Todo lo que necesitas para prepararte
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
          Una herramienta completa, simple y potenciada por IA.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {FEATURES.map(({ icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 hover:border-gray-300 transition-colors"
          >
            <span className="text-3xl">{icon}</span>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-base text-gray-400 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

    </motion.section>
  );
}
