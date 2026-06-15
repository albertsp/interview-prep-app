"use client";

import { motion } from "framer-motion"
import { useRouter} from "next/navigation"

export default function CTA() {

    const router = useRouter()

    return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-200px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full px-6 py-20 bg-white flex flex-col items-center text-center"
    >

      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 max-w-md">
        ¿Listo para tu próxima entrevista?
      </h2>

      <p className="text-gray-400 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
        Configura tu sesión en segundos y empieza a practicar ahora.
      </p>

      <button
        onClick={() => router.push("/register")}
        className="px-10 py-4 rounded-2xl bg-gray-900 text-white text-base font-medium hover:bg-gray-700 transition-colors"
      >
        Empezar ahora
      </button>

    </motion.section>
  );
}
