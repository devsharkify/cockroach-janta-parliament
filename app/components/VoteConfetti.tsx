'use client'
import { useEffect, useRef } from 'react'

export default function VoteConfetti({
  active,
  onComplete,
}: {
  active: boolean
  onComplete: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const colors = ['#D4A017', '#7F77DD', '#1D9E75', '#D85A30', '#D4537E', '#FFFFFF']
    const particles: HTMLDivElement[] = []

    for (let i = 0; i < 80; i++) {
      const p = document.createElement('div')
      const rotation = Math.floor(Math.random() * 720)
      p.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        left: ${Math.random() * 100}vw;
        top: -20px;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 2 + 1.5}s ease-in forwards;
        animation-delay: ${Math.random() * 0.5}s;
        --rot: ${rotation}deg;
      `
      document.body.appendChild(p)
      particles.push(p)
    }

    const timer = setTimeout(() => {
      particles.forEach((p) => p.remove())
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(timer)
      particles.forEach((p) => p.remove())
    }
  }, [active, onComplete])

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(var(--rot, 360deg)); opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} />
    </>
  )
}
