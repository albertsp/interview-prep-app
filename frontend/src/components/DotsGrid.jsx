"use client"

import { useRef, useEffect } from "react"

const DOT_GAP = 40
const DOT_RADIUS = 1.2
const GLOW_RADIUS = 100

export default function DotsGrid() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 })
  const frameRef = useRef(null)
  const dotsRef = useRef([])
  const dimsRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const buildDots = (w, h) => {
      const dots = []
      for (let x = DOT_GAP; x < w; x += DOT_GAP) {
        for (let y = DOT_GAP; y < h; y += DOT_GAP) {
          dots.push({ x, y })
        }
      }
      dotsRef.current = dots
    }

    const resize = () => {
      const w = (canvas.width = canvas.offsetWidth)
      const h = (canvas.height = canvas.offsetHeight)
      dimsRef.current = { w, h }
      buildDots(w, h)
    }

    resize()
    window.addEventListener("resize", resize)

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.tx = e.clientX - rect.left
      mouseRef.current.ty = e.clientY - rect.top
    }

    const handleLeave = () => {
      mouseRef.current.tx = -1000
      mouseRef.current.ty = -1000
    }

    canvas.addEventListener("mousemove", handleMove)
    canvas.addEventListener("mouseleave", handleLeave)

    const animate = () => {
      if (!ctx) return
      const { w, h } = dimsRef.current
      const m = mouseRef.current

      // Smooth mouse interpolation
      m.x += (m.tx - m.x) * 0.1
      m.y += (m.ty - m.y) * 0.1

      ctx.clearRect(0, 0, w, h)

      for (const dot of dotsRef.current) {
        const dx = dot.x - m.x
        const dy = dot.y - m.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        let alpha = 0.08
        let radius = DOT_RADIUS

        if (dist < GLOW_RADIUS) {
          const t = 1 - dist / GLOW_RADIUS
          alpha = 0.08 + t * t * 0.55
          radius = DOT_RADIUS + t * 2.2
        }

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 100, 120, ${alpha})`
        ctx.fill()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMove)
      canvas.removeEventListener("mouseleave", handleLeave)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-auto"
    />
  )
}
