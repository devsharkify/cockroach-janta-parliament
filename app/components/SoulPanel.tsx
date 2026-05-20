'use client'

import { useState, useEffect } from 'react'
import { useFingerprint } from '@/lib/hooks/useFingerprint'
import { SOUL_LEVELS, XP_REWARDS } from '@/lib/types'

interface SoulData {
  level: number
  xp: number
  totalVotes: number
  totalCandidacies: number
}

interface Props {
  className?: string
}

const LEVEL_ICONS: Record<number, string> = {
  1: '🥚',
  2: '🪳',
  3: '🦂',
  4: '👑',
  5: '⚡',
  6: '🌟',
}

function getLevelInfo(xp: number) {
  let current: (typeof SOUL_LEVELS)[number] = SOUL_LEVELS[0]
  let next: (typeof SOUL_LEVELS)[number] | null = SOUL_LEVELS[1]
  for (let i = SOUL_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= SOUL_LEVELS[i].xpRequired) {
      current = SOUL_LEVELS[i]
      next = SOUL_LEVELS[i + 1] ?? null
      break
    }
  }
  return { current, next }
}

function getMotivation(level: number): string {
  if (level === 1) return 'Vote once to become a Nymph'
  if (level === 2) return 'File candidacy for +10 XP'
  if (level <= 4) return 'Keep voting. The naali needs you.'
  return 'You are the Supreme.'
}

const DEFAULT_SOUL: SoulData = {
  level: 1,
  xp: 0,
  totalVotes: 0,
  totalCandidacies: 0,
}

export default function SoulPanel({ className = '' }: Props) {
  const fingerprint = useFingerprint()
  const [soul, setSoul] = useState<SoulData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!fingerprint) return

    const fetchSoul = async () => {
      try {
        const res = await fetch(`/api/soul?fp=${fingerprint}`)
        if (!res.ok) throw new Error('soul fetch failed')
        const data = await res.json()
        setSoul({
          level: data.level ?? 1,
          xp: data.xp ?? 0,
          totalVotes: data.total_votes ?? 0,
          totalCandidacies: data.total_candidacies ?? 0,
        })
      } catch {
        setSoul(DEFAULT_SOUL)
      } finally {
        setLoading(false)
      }
    }

    fetchSoul()
  }, [fingerprint])

  const displaySoul = soul ?? DEFAULT_SOUL
  const isDefault = soul === null && !loading

  const { current, next } = getLevelInfo(displaySoul.xp)
  const icon = LEVEL_ICONS[current.level] ?? '🥚'
  const motivation = getMotivation(current.level)

  const progressPct = next
    ? Math.min(
        100,
        ((displaySoul.xp - current.xpRequired) /
          (next.xpRequired - current.xpRequired)) *
          100
      )
    : 100

  return (
    <div
      className={`w-full max-w-sm rounded-2xl border-2 border-yellow-300/30 p-4 ${className}`}
      style={{ backgroundColor: '#3C3489' }}
    >
      {loading && !soul ? (
        <div className="flex items-center justify-center py-4">
          <span className="animate-pulse text-yellow-300/60 text-sm">Loading soul…</span>
        </div>
      ) : (
        <>
          {/* Header row */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl leading-none">{icon}</span>
            <div>
              <p className="text-lg font-bold text-white leading-tight">{current.name}</p>
              <p className="text-xs" style={{ color: '#D4A017' }}>
                Level {current.level}
              </p>
            </div>
          </div>

          {/* XP bar */}
          <div className="mb-1">
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-yellow-300 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* XP label */}
          <p className="text-xs mb-3" style={{ color: '#D4A017' }}>
            {displaySoul.xp} / {next ? next.xpRequired : current.xpRequired} XP
          </p>

          {/* Stat chips */}
          <div className="flex gap-2 mb-3">
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              🗳️ {displaySoul.totalVotes} votes
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              🪳 {displaySoul.totalCandidacies} filed
            </span>
          </div>

          {/* Motivational text */}
          {(isDefault || soul) && (
            <p className="text-xs text-yellow-300/70 italic">
              {isDefault && displaySoul.totalVotes === 0
                ? 'Start voting to level up!'
                : motivation}
            </p>
          )}
        </>
      )}
    </div>
  )
}
