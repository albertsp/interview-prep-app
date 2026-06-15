"use client"

import { motion } from "framer-motion"

const STEPS = [
  {
    number: "1",
    title: "Configura tu sesión",
    description: "Elige tu rol, la tecnología que quieres practicar y tu nivel de experiencia.",
  },
  {
    number: "2",
    title: "La IA genera tu examen",
    description: "En segundos tienes 5 preguntas personalizadas listas para responder.",
  },
  {
    number: "3",
    title: "Practica con las cards",
    description: "Revisa cada pregunta con su respuesta explicada, guardada en tu historial.",
  },
];

export default function HowItWorks() {
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
          Cómo funciona
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
          Tres pasos para prepararte para tu próxima entrevista.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col sm:flex-row items-start justify-center gap-8 max-w-3xl mx-auto">
        {STEPS.map(({ number, title, description }, index) => (
          <div key={number} className="flex flex-col items-center text-center gap-4 flex-1">

            {/* Number + connector */}
            <div className="flex items-center w-full justify-center gap-2">
              {/* Left line */}
              {index !== 0 && (
                <div className="hidden sm:block flex-1 h-px bg-gray-200" />
              )}
              <div className="w-12 h-12 rounded-full border-2 border-gray-900 bg-white flex items-center justify-center text-base font-bold text-gray-900 shrink-0">
                {number}
              </div>
              {/* Right line */}
              {index !== STEPS.length - 1 && (
                <div className="hidden sm:block flex-1 h-px bg-gray-200" />
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-base text-gray-400 leading-relaxed">{description}</p>
            </div>

          </div>
        ))}
      </div>

    </motion.section>
  );
}
