'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  reset: () => void
  unstable_retry?: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const handleRetry = unstable_retry ?? reset

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1a0a1a] text-white px-4 overflow-hidden">
      {/* Roaches still scuttle even when things break */}
      <span className="roach-sprite" style={{ animationDuration: '16s', animationDelay: '-2s', bottom: '12px' }}>🪳</span>
      <span className="roach-sprite" style={{ animationDuration: '24s', animationDelay: '-11s', bottom: '36px' }}>🪳</span>

      <div className="relative z-10 text-center max-w-xl mx-auto">
        <p className="text-7xl mb-4" aria-hidden="true">🪳</p>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-red-400 mb-4">
          The Naali Overflowed
        </h1>

        <p className="text-lg sm:text-xl text-purple-200 mb-6 leading-relaxed">
          Something broke. The cockroach system encountered an unexpected obstacle. This is embarrassing.
        </p>

        {/* Error detail */}
        {error?.message && (
          <pre className="bg-black/40 border border-red-500/30 rounded-lg px-4 py-3 mb-6 text-left text-sm text-red-300 font-mono overflow-x-auto whitespace-pre-wrap break-words">
            {error.message}
            {error.digest && (
              <span className="block mt-1 text-xs text-red-500/60">digest: {error.digest}</span>
            )}
          </pre>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 bg-red-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-400 transition-colors text-base cursor-pointer"
          >
            Try Again 🔄
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors text-base"
          >
            ← Back to Parliament
          </Link>
        </div>
      </div>
    </div>
  )
}
