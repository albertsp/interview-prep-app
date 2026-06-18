"use client";

import { motion } from "framer-motion";
import { FileCode2, Paintbrush, Braces, Atom, Code2, Database } from "lucide-react";

const TECHS = [
  { name: "HTML", Icon: FileCode2, color: "text-orange-400" },
  { name: "CSS", Icon: Paintbrush, color: "text-blue-400" },
  { name: "JavaScript", Icon: Braces, color: "text-yellow-400" },
  { name: "React", Icon: Atom, color: "text-cyan-400" },
  { name: "Python", Icon: Code2, color: "text-emerald-400" },
  { name: "SQL", Icon: Database, color: "text-violet-400" },
];

const duplicated = [...TECHS, ...TECHS];

export default function Techs() {
  return (
    <section className="w-full py-24 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-mono text-sm font-medium tracking-wide uppercase mb-4 block">
            Stacks disponibles
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Practica con las tecnologías más demandadas
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Frontend, backend o datos — eliges tú.
          </p>
        </motion.div>

        <div className="relative mt-8 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <motion.div
            className="flex gap-5"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {duplicated.map(({ name, Icon, color }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 flex-shrink-0 w-32 sm:w-40 py-7 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className={`size-5 ${color}`} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold text-foreground">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}