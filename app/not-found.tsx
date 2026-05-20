import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — This Seat Doesn\'t Exist',
  description: 'Even cockroaches can\'t find this constituency.',
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0f0b30] text-white px-4 overflow-hidden">
      {/* Animated scuttling cockroach */}
      <span className="roach-sprite" style={{ animationDuration: '14s', animationDelay: '0s', bottom: '16px' }}>🪳</span>
      <span className="roach-sprite" style={{ animationDuration: '22s', animationDelay: '-7s', bottom: '40px' }}>🪳</span>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Giant 404 */}
        <p className="text-[10rem] sm:text-[14rem] font-black leading-none text-yellow-300 select-none" aria-hidden="true">
          404
        </p>
        <p className="text-5xl sm:text-6xl mb-4" aria-hidden="true">🪳</p>

        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest text-yellow-300 mb-4">
          This Seat Doesn&apos;t Exist
        </h1>

        <p className="text-lg sm:text-xl text-purple-200 mb-6 leading-relaxed">
          Even cockroaches can&apos;t find this constituency. It may have been withdrawn, eaten, or never existed.
        </p>

        {/* Fun fact box */}
        <div className="bg-white/5 border border-yellow-300/20 rounded-xl px-6 py-4 mb-8 text-sm sm:text-base text-purple-100 italic">
          <span className="text-yellow-300 font-semibold not-italic">Fun fact:</span>{' '}
          There are only 543 seats. You tried to access one that isn&apos;t one of them.
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-yellow-300 text-[#0f0b30] font-bold px-6 py-3 rounded-lg hover:bg-yellow-200 transition-colors text-base"
          >
            ← Back to Parliament
          </Link>
          <Link
            href="/seat/273"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors text-base"
          >
            🎲 Random Seat
          </Link>
        </div>
      </div>
    </div>
  )
}
