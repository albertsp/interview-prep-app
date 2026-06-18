"use client";

import { motion } from "framer-motion";
import { Settings2, Sparkles, Layers } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Settings2,
    title: "Configura tu sesión",
    description: "Elige tu rol, la tecnología y tu nivel de experiencia. La IA se adapta a ti.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "La IA genera tu entrevista",
    description: "5 preguntas personalizadas en segundos. Como una entrevista real, pero sin presión.",
  },
  {
    number: "03",
    icon: Layers,
    title: "Repasa con cards",
    description: "Cada pregunta viene con su respuesta explicada. Guarda, revisa y mejora sesión tras sesión.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full px-6 py-24 sm:py-32 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm font-medium tracking-wide uppercase mb-4 block">
            Cómo funciona
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Tres pasos. Una entrevista.
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            De la configuración al feedback en menos de 5 minutos.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {/* Connecting line - hidden on mobile */}
          <div className="hidden sm:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-border via-primary/40 to-border" />

          {STEPS.map(({ number, icon: Icon, title, description }, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center gap-5"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="size-6 text-primary" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-mono">
                  {number}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}