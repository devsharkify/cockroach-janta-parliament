'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Filing {
  id: string
  displayName: string
  seatName: string
  state: string
  stateCode: string
  partyCode: string | null
  partyColor: string | null
  seatNumber: number
  isIndependent: boolean
  createdAt: string
}

interface Props {
  className?: string
}

const MOCK_FILINGS: Filing[] = [
  { id: '1', displayName: 'Mumbai_Kachra_official', seatName: 'Varanasi', state: 'Uttar Pradesh', stateCode: 'UP', partyCode: 'CJP', partyColor: '#7F77DD', seatNumber: 485, isIndependent: false, createdAt: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: '2', displayName: 'Macchar_Raja', seatName: 'Patna Sahib', state: 'Bihar', stateCode: 'BR', partyCode: 'ACP', partyColor: '#1D9E75', seatNumber: 52, isIndependent: false, createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: '3', displayName: 'Naali_Sardar', seatName: 'Bengaluru Central', state: 'Karnataka', stateCode: 'KA', partyCode: 'CCP', partyColor: '#D85A30', seatNumber: 173, isIndependent: false, createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: '4', displayName: 'Khatmal_OG', seatName: 'Mumbai North', state: 'Maharashtra', stateCode: 'MH', partyCode: 'RCP', partyColor: '#D4537E', seatNumber: 254, isIndependent: false, createdAt: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: '5', displayName: 'Gobar_da_real', seatName: 'Lucknow', state: 'Uttar Pradesh', stateCode: 'UP', partyCode: 'CJP', partyColor: '#7F77DD', seatNumber: 467, isIndependent: false, createdAt: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: '6', displayName: 'Netagiri_OFF', seatName: 'Hyderabad', state: 'Telangana', stateCode: 'TG', partyCode: null, partyColor: null, seatNumber: 393, isIndependent: true, createdAt: new Date(Date.now() - 48 * 60000).toISOString() },
  { id: '7', displayName: 'Ghoos_Free_Zindagi', seatName: 'Chennai Central', state: 'Tamil Nadu', stateCode: 'TN', partyCode: 'ACP', partyColor: '#1D9E75', seatNumber: 357, isIndependent: false, createdAt: new Date(Date.now() - 62 * 60000).toISOString() },
  { id: '8', displayName: 'Roach_Mafia_88', seatName: 'New Delhi', state: 'Delhi', stateCode: 'DL', partyCode: 'CJP', partyColor: '#7F77DD', seatNumber: 101, isIndependent: false, createdAt: new Date(Date.now() - 75 * 60000).toISOString() },
]

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  return `${Math.floor(secs / 3600)}h ago`
}

export default function FilingFrenzy({ className = '' }: Props) {
  const router = useRouter()
  const [filings, setFilings] = useState<Filing[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFilings = async () => {
    try {
      const res = await fetch('/api/filings/recent')
      if (!res.ok) throw new Error('fetch failed')
      const data: Filing[] = await res.json()
      setFilings(data)
    } catch {
      setFilings(MOCK_FILINGS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilings()

    const interval = setInterval(fetchFilings, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'red',
            animation: 'pulse 1.5s infinite',
          }}
        />
        <span className="font-black text-base uppercase tracking-wide">
          LIVE &nbsp;·&nbsp; Filing Frenzy
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-4 border-black rounded-xl px-4 py-2.5 bg-gray-200 animate-pulse"
                style={{ height: 64 }}
              />
            ))}
          </>
        ) : (
          filings.map((filing) => (
            <div
              key={filing.id}
              className="border-4 border-black rounded-xl px-4 py-2.5 bg-white hover:bg-yellow-50 cursor-pointer shadow-[3px_3px_0_black] transition-colors"
              onClick={() => router.push(`/seat/${filing.seatNumber}`)}
            >
              <div className="flex items-center gap-3">
                {/* Cockroach emoji */}
                <span className="text-xl leading-none select-none">🪳</span>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate leading-tight">
                    {filing.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {filing.seatName} · {filing.stateCode}
                  </p>
                </div>

                {/* Right side: party badge + time */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {filing.isIndependent || !filing.partyCode ? (
                    <span className="rounded-full bg-gray-400 px-2 py-0.5 text-xs font-black text-white">
                      IND
                    </span>
                  ) : (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-black text-white"
                      style={{ backgroundColor: filing.partyColor ?? '#888' }}
                    >
                      {filing.partyCode}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{timeAgo(filing.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
