"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"

const HERO_TEXT = "Prepárate para tu próxima entrevista técnica";
const CHAR_INTERVAL = 60;

export default function Hero() {

  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    setIsTyping(true)
    let i = 0
    let lastTime = 0
    let rafId

    function step(timestamp) {
      if (!lastTime) lastTime = timestamp
      const elapsed = timestamp - lastTime

      if (elapsed >= CHAR_INTERVAL) {
        i++
        lastTime = timestamp - (elapsed - CHAR_INTERVAL)
        if (textRef.current) {
          textRef.current.textContent = HERO_TEXT.slice(0, i)
        }
      }

      if (i < HERO_TEXT.length) {
        rafId = requestAnimationFrame(step)
      } else {
        setIsTyping(false)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [mounted])

  return (
    <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 min-h-screen bg-white [background-image:linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:64px_64px]">

      <div className="relative z-10 flex flex-col items-center text-center">

        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative inline-flex items-center gap-1.5 mb-8 px-5 py-2 rounded-full border border-indigo-200/50 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 text-indigo-500 text-base font-medium shadow-sm shadow-indigo-200/20 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            Potenciado por IA
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 4 }}
          />
        </motion.span>

      <h1 ref={textRef} className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 max-w-5xl">
        {HERO_TEXT}
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
