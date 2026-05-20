'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalCandidates: number
  totalVotes: number
  totalSeats: number
  totalSouls: number
  activeCycle: boolean
  nextSnapshot: string | null
}

const DEFAULTS: Stats = {
  totalCandidates: 12847,
  totalVotes: 394201,
  totalSeats: 543,
  totalSouls: 8934,
  activeCycle: true,
  nextSnapshot: null,
}

function fmt(n: number) {
  if (n >= 1_00_000) return (n / 1_00_000).toFixed(1) + 'L'
  if (n >= 1_000)    return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString('en-IN')
}

export default function LiveStats({
  initialCandidates = DEFAULTS.totalCandidates,
  initialVotes = DEFAULTS.totalVotes,
}: {
  initialCandidates?: number
  initialVotes?: number
}) {
  const [stats, setStats] = useState<Stats>({
    ...DEFAULTS,
    totalCandidates: initialCandidates,
    totalVotes: initialVotes,
  })
  const [flash, setFlash] = useState(false)

  async function refresh() {
    try {
      const res = await fetch('/api/stats', { next: { revalidate: 0 } })
      if (!res.ok) return
      const data: Stats = await res.json()
      setStats(data)
      setFlash(true)
      setTimeout(() => setFlash(false), 400)
    } catch { /* silent */ }
  }

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 60_000)
    return () => clearInterval(id)
  }, [])

  const pillClass = `rounded-xl border-4 border-black px-4 py-2 shadow-[3px_3px_0_black] transition-colors duration-300 ${
    flash ? 'bg-yellow-100' : 'bg-white'
  }`

  return (
    <div className="flex gap-3 mb-6 flex-wrap justify-center">
      <div className={pillClass}>
        <span className="font-black text-xl text-black">{fmt(stats.totalCandidates)}</span>
        <span className="text-xs font-bold text-black/50 ml-1.5">roaches filed</span>
      </div>
      <div className={pillClass}>
        <span className="font-black text-xl text-black">{fmt(stats.totalVotes)}</span>
        <span className="text-xs font-bold text-black/50 ml-1.5">votes cast</span>
      </div>
      {stats.activeCycle && (
        <div className={`${pillClass} flex items-center gap-1.5`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs font-black text-black/70 uppercase tracking-wide">LIVE CYCLE</span>
        </div>
      )}
    </div>
  )
}
