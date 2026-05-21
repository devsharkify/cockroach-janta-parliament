import Link from 'next/link'
import { HOT_SEATS } from '@/lib/hotSeats'

function heatBadge(heat: 1 | 2 | 3) {
  if (heat === 3) return '🔥🔥🔥'
  if (heat === 2) return '🔥🔥'
  return '🔥'
}

function cardBg(heat: 1 | 2 | 3) {
  if (heat === 3) return 'bg-yellow-300'
  if (heat === 2) return 'bg-white'
  return 'bg-gray-50'
}

export default function HotSeats() {
  return (
    <section className="bg-white border-b-8 border-black py-10 px-4">
      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-5xl font-black text-black uppercase leading-tight"
          style={{ letterSpacing: '-1px', textShadow: '3px 3px 0 rgba(0,0,0,0.12)' }}>
          🔥 HOT SEATS — CONTEST HERE
        </h2>
        <p className="text-black/55 font-mono text-sm mt-2">
          India's most viral battlefields
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {HOT_SEATS.map((seat) => (
          <div
            key={seat.number}
            className={`relative flex flex-col border-4 border-black shadow-[4px_4px_0_black] rounded-xl p-4 ${cardBg(seat.heat)}`}
          >
            {/* Heat badge */}
            <span className="absolute top-3 right-3 text-sm leading-none">
              {heatBadge(seat.heat)}
            </span>

            {/* Name */}
            <p className="font-black text-lg text-black leading-tight pr-10 mb-1">
              {seat.name}
            </p>

            {/* State pill */}
            <span className="inline-block self-start bg-black text-yellow-300 font-black text-[10px] px-2 py-0.5 rounded-full mb-2 tracking-widest">
              {seat.stateCode}
            </span>

            {/* Reason */}
            <p className="text-black/60 font-mono text-xs italic leading-snug flex-1 mb-4">
              {seat.reason}
            </p>

            {/* CTA */}
            <Link
              href={`/file?seat=${seat.number}`}
              className="block text-center py-2 px-3 bg-black text-yellow-300 font-black text-xs border-2 border-black rounded-lg hover:bg-[#7F77DD] transition-colors shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
            >
              CONTEST HERE →
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
