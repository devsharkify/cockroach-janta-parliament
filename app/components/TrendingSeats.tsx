'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TrendingSeat {
  seat_number: number
  seat_name: string
  state: string
  votes24h: number
}

const MOCK_TRENDING: TrendingSeat[] = [
  { seat_number: 485, seat_name: 'Varanasi',     state: 'UP',  votes24h: 4821 },
  { seat_number: 101, seat_name: 'New Delhi',    state: 'DL',  votes24h: 3204 },
  { seat_number: 52,  seat_name: 'Patna Sahib',  state: 'BR',  votes24h: 2791 },
  { seat_number: 19,  seat_name: 'Mumbai North', state: 'MH',  votes24h: 2199 },
  { seat_number: 348, seat_name: 'Hyderabad',    state: 'TS',  votes24h: 1855 },
]

function fireMeter(votes: number): string {
  if (votes >= 4000) return '🔥🔥🔥'
  if (votes >= 2000) return '🔥🔥'
  return '🔥'
}

export default function TrendingSeats() {
  const [seats, setSeats] = useState<TrendingSeat[]>(MOCK_TRENDING)
  const [loading, setLoading] = useState(true)

  async function fetchTrending() {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (Array.isArray(data.trendingSeats) && data.trendingSeats.length > 0) {
        setSeats(data.trendingSeats.slice(0, 5).map((s: { seat_number: number; seat_name?: string; state?: string; votes24h?: number }) => ({
          seat_number: s.seat_number,
          seat_name:   s.seat_name  ?? `Seat ${s.seat_number}`,
          state:       s.state      ?? '—',
          votes24h:    s.votes24h   ?? 0,
        })))
      }
    } catch {
      // keep mock data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrending()
    const id = setInterval(fetchTrending, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-2xl border-4 border-black overflow-hidden shadow-[6px_6px_0_black]" style={{ background: '#0f0b30' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b-4 border-yellow-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="font-black text-yellow-300 text-sm uppercase tracking-wider">Trending Battlefields</span>
        </div>
        <span className="text-yellow-300/50 text-xs font-mono">last 24h</span>
      </div>

      {/* Seats */}
      <div className="divide-y-2 divide-white/10">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-6 h-4 rounded bg-white/10" />
                <div className="flex-1 h-4 rounded bg-white/10" />
                <div className="w-16 h-4 rounded bg-white/10" />
              </div>
            ))
          : seats.map((s, i) => (
              <Link
                key={s.seat_number}
                href={`/seat/${s.seat_number}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
              >
                {/* Rank */}
                <span className="text-white/30 font-black text-sm w-5 shrink-0 text-center">
                  {i + 1}
                </span>

                {/* Name + state */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-sm truncate group-hover:text-yellow-300 transition-colors">
                    {s.seat_name}
                    <span className="ml-1.5 text-[10px] font-mono text-white/40">#{s.seat_number}</span>
                  </p>
                  <p className="text-white/40 text-xs font-mono">{s.state}</p>
                </div>

                {/* Fire + votes */}
                <div className="text-right shrink-0">
                  <div className="text-sm leading-none">{fireMeter(s.votes24h)}</div>
                  <div className="text-[10px] font-mono text-white/50 mt-0.5">
                    {s.votes24h.toLocaleString('en-IN')} votes
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t-2 border-white/10 text-right">
        <Link
          href="/results"
          className="text-xs font-black text-yellow-300/60 hover:text-yellow-300 transition-colors uppercase tracking-wider"
        >
          VIEW FULL RESULTS →
        </Link>
      </div>
    </div>
  )
}
