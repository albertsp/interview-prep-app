"use client"

import { motion } from "framer-motion"
import { FileCode2, Paintbrush, Braces, Atom, Code2, Database } from "lucide-react"

const TECHS = [
  { name: "HTML", Icon: FileCode2, bg: "bg-orange-500/10", text: "text-orange-600", ring: "ring-orange-500/20" },
  { name: "CSS", Icon: Paintbrush, bg: "bg-blue-500/10", text: "text-blue-600", ring: "ring-blue-500/20" },
  { name: "JavaScript", Icon: Braces, bg: "bg-yellow-500/10", text: "text-yellow-600", ring: "ring-yellow-500/20" },
  { name: "React", Icon: Atom, bg: "bg-cyan-500/10", text: "text-cyan-600", ring: "ring-cyan-500/20" },
  { name: "Python", Icon: Code2, bg: "bg-emerald-500/10", text: "text-emerald-600", ring: "ring-emerald-500/20" },
  { name: "SQL", Icon: Database, bg: "bg-violet-500/10", text: "text-violet-600", ring: "ring-violet-500/20" },
]

const duplicated = [...TECHS, ...TECHS]

export default function Techs() {
  return (
<motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full py-16 bg-gray-50 overflow-hidden"
    >
 
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Tecnologías disponibles
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Practica con las tecnologías más demandadas del mercado.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
        <motion.div
          className="flex gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          {duplicated.map(({ name, Icon, bg, text, ring }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 flex-shrink-0 w-36 py-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} ring-1 ${ring} flex items-center justify-center`}>
                <Icon className={`size-6 ${text}`} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{name}</span>
            </div>
          ))}
        </motion.div>
      </div>

    </motion.section>
  )
}
