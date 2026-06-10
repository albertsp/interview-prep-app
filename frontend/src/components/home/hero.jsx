"use client";

import { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import DotsGrid from "@/components/DotsGrid"

const HERO_TEXT = "Prepárate para tu próxima entrevista técnica";

export default function Hero() {

  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    setIsTyping(true)

    const controls = animate(0, HERO_TEXT.length, {
      duration: HERO_TEXT.length * 0.06,
      ease: "linear",
      onUpdate(latest) {
        setDisplayedText(HERO_TEXT.slice(0, Math.floor(latest)))
      },
      onComplete() {
        setDisplayedText(HERO_TEXT)
        setIsTyping(false)
      },
    })

    return () => controls.stop()
  }, [mounted])

  return (
    <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 min-h-screen bg-white">

      <DotsGrid />

      <div className="relative z-10 flex flex-col items-center text-center">

        <span className="inline-block mb-8 px-5 py-2 rounded-full border border-gray-200 text-gray-400 text-base">
            ✦ Potenciado por IA
        </span>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 max-w-5xl">
        {mounted ? displayedText : HERO_TEXT}
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            className="inline-block w-1 h-[1em] bg-gray-900 ml-1 align-middle"
          />
        )}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: HERO_TEXT.length * 0.06 + 0.05, duration: 0.5, ease: "easeOut" }}
        className="text-gray-400 text-lg sm:text-xl max-w-lg mb-8 leading-relaxed"
      >
        Configura tu entrevista personalizada en tres pasos
      </motion.p>


      <div className="flex flex-wrap gap-3 justify-center mb-10">

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: HERO_TEXT.length * 0.06 + 0.2, duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/register")}
          className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gray-900 text-white text-lg font-medium shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 transition-shadow cursor-pointer"
        >
          <span>Empezar ahora</span>
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>

      </div>

    </section>
  );
}
