'use client'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  candidateName: string
  seatName: string
  seatNumber: number
  voteCount: number
  partyCode: string | null
}

export default function ShareModal({
  isOpen,
  onClose,
  candidateName,
  seatName,
  seatNumber,
  voteCount,
  partyCode,
}: Props) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/seat/${seatNumber}`
      : `/seat/${seatNumber}`

  const message = `🪳 I just voted for ${candidateName} in ${seatName}! They have ${voteCount} votes. Join the Cockroach Janta Parliament! ${url} #CockroachJantaParliament`
  const encodedMsg = encodeURIComponent(message)

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${encodedMsg}`, '_blank', 'noopener,noreferrer')
  }

  function handleTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedMsg}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select a temp input
      const inp = document.createElement('input')
      inp.value = url
      document.body.appendChild(inp)
      inp.select()
      document.execCommand('copy')
      inp.remove()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Vote for ${candidateName}`, text: message, url })
      } catch {
        // user cancelled or unsupported — ignore
      }
    }
  }

  return (
    /* overlay */
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* card */}
      <div
        className="bg-white border-4 border-black rounded-2xl max-w-sm w-full shadow-[8px_8px_0_black] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="bg-[#3C3489] px-5 py-4 flex items-center justify-between">
          <h2 className="text-white font-black text-xl">Share this roach! 🪳</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white font-black text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* candidate preview */}
        <div className="px-5 pt-4 pb-2">
          <div className="bg-[#FAFAF7] border-2 border-gray-200 rounded-xl p-3 flex items-center gap-3">
            <span className="text-3xl">🪳</span>
            <div className="min-w-0">
              <p className="font-black text-[#1a1a2e] truncate">{candidateName}</p>
              <p className="text-xs text-gray-500 truncate">
                {seatName} · {voteCount} vote{voteCount !== 1 ? 's' : ''}
                {partyCode ? ` · ${partyCode}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* share buttons */}
        <div className="px-5 pt-3 pb-5 space-y-2">
          {/* WhatsApp — primary */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-3 rounded-xl border-4 border-black hover:brightness-90 transition-all"
          >
            <span className="text-lg">📱</span> Share on WhatsApp
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitter}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-black py-3 rounded-xl border-4 border-black hover:bg-gray-800 transition-all"
          >
            <span className="text-lg">𝕏</span> Post on Twitter / X
          </button>

          <div className="flex gap-2">
            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-black font-black py-3 rounded-xl border-4 border-black hover:bg-gray-200 transition-all text-sm"
            >
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>

            {/* Native share — only renders if supported */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="flex-1 flex items-center justify-center gap-1 bg-[#D4A017] text-black font-black py-3 rounded-xl border-4 border-black hover:bg-yellow-300 transition-all text-sm"
              >
                📤 More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
