'use client'

import { useState, useEffect } from 'react'

const IG_URL = 'https://www.instagram.com/cockroachparliament_official'
const IG_HANDLE = '@cockroachparliament_official'
const STORAGE_KEY = 'cjp_ig_popup_v1'

export default function InstagramPopup() {
  const [visible, setVisible] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed
    try {
      const val = localStorage.getItem(STORAGE_KEY)
      if (val) return
    } catch { /* ignore */ }

    // Show after 3 seconds
    const t = setTimeout(() => {
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true))
      })
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setAnimateIn(false)
    setTimeout(() => setVisible(false), 300)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
  }

  function followAndDismiss() {
    window.open(IG_URL, '_blank', 'noopener,noreferrer')
    dismiss()
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          opacity: animateIn ? 1 : 0,
        }}
        onClick={dismiss}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-sm rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0_black] transition-all duration-300"
          style={{
            transform: animateIn ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(40px)',
            opacity: animateIn ? 1 : 0,
          }}
        >
          {/* IG gradient header */}
          <div
            className="px-6 pt-8 pb-6 text-center relative"
            style={{
              background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
            }}
          >
            {/* Dismiss X */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm font-black transition-colors"
            >
              ✕
            </button>

            {/* Roach + IG icon */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-5xl drop-shadow-lg">🪳</span>
              <span className="text-white text-3xl font-black">×</span>
              <span className="text-4xl">📸</span>
            </div>

            <h2 className="font-black text-white text-2xl uppercase leading-tight mb-1 drop-shadow">
              We&apos;re on Instagram!
            </h2>
            <p className="text-white/80 font-mono text-sm">
              Daily chaos. Constituency drama.<br />Cockroach election memes.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-5 text-center">
            {/* Handle */}
            <div className="inline-flex items-center gap-2 bg-black/5 border-2 border-black/10 rounded-full px-4 py-2 mb-4">
              <span className="text-lg">📷</span>
              <span className="font-black text-sm text-black">{IG_HANDLE}</span>
            </div>

            {/* Social proof */}
            <p className="text-black/50 font-mono text-xs mb-5 leading-relaxed">
              Follow to get live election updates,<br />
              viral candidate reveals &amp; Sunday results 🏆
            </p>

            {/* Primary CTA */}
            <button
              onClick={followAndDismiss}
              className="w-full py-4 rounded-2xl font-black text-white text-base border-4 border-black shadow-[4px_4px_0_black] hover:scale-[1.02] active:scale-[0.98] transition-all mb-3"
              style={{
                background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
              }}
            >
              📸 Follow on Instagram →
            </button>

            {/* Secondary */}
            <button
              onClick={dismiss}
              className="w-full py-2.5 rounded-xl font-black text-black/30 text-xs hover:text-black/60 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
