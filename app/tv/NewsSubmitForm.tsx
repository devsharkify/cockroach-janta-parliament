'use client'

import { useState, useEffect } from 'react'

/* ── Journalist identity generator ──────────────────────────────────────── */
const J_ADJ = [
  'Viral', 'Breaking', 'Exclusive', 'Drainage', 'Galli',
  'Sarkari', 'Underground', 'Bawaal', 'Desi', 'Naali',
  'Jugaad', 'Bindaas', 'Kachra', 'Trending', 'Supreme',
]
const J_NOUN = [
  'Singh', 'Kumar', 'Sharma', 'Verma', 'Gupta',
  'Lal', 'Rao', 'Mishra', 'Khan', 'Das',
  'Nair', 'Pillai', 'Joshi', 'Tiwari', 'Iyer',
]
const J_ROLES = [
  'Chief Drain Correspondent, CJTV',
  'Political Affairs Reporter, CJTV',
  'Senior Naali Analyst, CJTV',
  'Breaking News Editor, CJTV',
  'Viral Affairs Correspondent, CJTV',
  'Field Reporter (Drains & Cockroaches), CJTV',
  'Senior Investigative Roach, CJTV',
  'Parliamentary Correspondent, CJTV',
  'Bribe Beat Reporter, CJTV',
  'Election Commission Watcher, CJTV',
]

function makeJournalist() {
  const a = J_ADJ[Math.floor(Math.random() * J_ADJ.length)]
  const n = J_NOUN[Math.floor(Math.random() * J_NOUN.length)]
  const r = J_ROLES[Math.floor(Math.random() * J_ROLES.length)]
  return { name: `${a}_${n}`, role: r }
}

/* ── Component ──────────────────────────────────────────────────────────── */
interface SubmittedArticle {
  headline: string
  body: string
  author: string
  authorRole: string
  publishedAt: string
}

export default function NewsSubmitForm() {
  const [journalist, setJournalist] = useState<{ name: string; role: string } | null>(null)
  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<SubmittedArticle | null>(null)
  const [error, setError] = useState('')

  /* Generate journalist identity once on mount */
  useEffect(() => { setJournalist(makeJournalist()) }, [])

  const rerollJournalist = () => setJournalist(makeJournalist())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!headline.trim() || !body.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/news/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: headline.trim(),
          body: body.trim(),
          authorName: journalist?.name,
          authorRole: journalist?.role,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setSubmitted(data.article)
      setHeadline('')
      setBody('')
      setJournalist(makeJournalist()) // fresh identity for next post
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-4 border-black rounded-2xl bg-white shadow-[6px_6px_0_black] overflow-hidden">

      {/* Header */}
      <div className="bg-black px-6 py-4 flex items-center gap-3 border-b-4 border-yellow-300">
        <span className="text-2xl">✍️</span>
        <div>
          <div className="font-black text-yellow-300 text-lg uppercase leading-none tracking-tight">
            Submit to CJTV
          </div>
          <div className="text-white/40 font-mono text-[10px] tracking-widest">
            You too can be a cockroach journalist · No experience required
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* Success state */}
        {submitted ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 bg-green-50 border-4 border-green-500 rounded-xl px-4 py-3">
              <span className="text-2xl">🪳</span>
              <div>
                <div className="font-black text-green-700 text-sm uppercase">Submitted to Newsroom!</div>
                <div className="font-mono text-green-600 text-xs">Your report is now live on CJTV. The nation has been informed.</div>
              </div>
            </div>

            {/* Article preview */}
            <div className="border-2 border-black rounded-xl overflow-hidden">
              <div className="bg-yellow-300 px-4 py-2 flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-widest text-black">Your Published Report</span>
                <span className="text-[9px] font-mono text-black/50">Just now</span>
              </div>
              <div className="px-4 py-4 bg-[#FAFAF7]">
                <h3 className="font-black text-base text-black leading-tight mb-2">{submitted.headline}</h3>
                <p className="font-mono text-xs text-black/60 leading-relaxed mb-3">{submitted.body}</p>
                <div className="flex items-center gap-2 text-[9px] font-mono text-black/40 pt-2 border-t border-black/10">
                  <span>✍️ <strong className="text-black/60">{submitted.author}</strong></span>
                  <span>·</span>
                  <span>{submitted.authorRole}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(null)}
              className="w-full py-2.5 border-4 border-black rounded-xl font-black text-sm uppercase hover:bg-black hover:text-yellow-300 transition-colors"
            >
              📝 Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Journalist identity */}
            <div className="bg-[#F5F5F0] border-2 border-black/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl shrink-0">🪳</span>
                <div className="min-w-0">
                  <div className="font-black text-sm text-black truncate">
                    {journalist?.name ?? '...'}
                  </div>
                  <div className="font-mono text-[10px] text-black/40 truncate">
                    {journalist?.role ?? 'Generating identity...'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={rerollJournalist}
                className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-2 border-black/20 hover:border-black hover:bg-black hover:text-white transition-colors"
              >
                🎲 Reroll
              </button>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-1.5">
              <label className="font-black text-xs uppercase tracking-widest text-black/60">
                Headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value.slice(0, 200))}
                placeholder="e.g. Onion prices hit ₹200/kg, cockroaches resort to crying instead"
                maxLength={200}
                required
                className="w-full border-4 border-black rounded-xl px-4 py-3 font-black text-sm text-black placeholder:font-mono placeholder:text-black/30 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              />
              <div className="text-[10px] font-mono text-black/30 text-right">{headline.length}/200</div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1.5">
              <label className="font-black text-xs uppercase tracking-widest text-black/60">
                Report Body <span className="text-red-500">*</span>
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value.slice(0, 1000))}
                placeholder="Write your investigative masterpiece here. Keep it satirical. Keep it roach."
                maxLength={1000}
                rows={5}
                required
                className="w-full border-4 border-black rounded-xl px-4 py-3 font-mono text-sm text-black placeholder:text-black/30 focus:outline-none focus:ring-4 focus:ring-yellow-300 resize-none"
              />
              <div className="text-[10px] font-mono text-black/30 text-right">{body.length}/1000</div>
            </div>

            {/* Disclaimer */}
            <p className="font-mono text-[9px] text-black/30 leading-relaxed">
              By submitting you confirm this is satire, contains no real names, no hate speech, and no actual political propaganda. CJTV reserves the right to drain any content it disagrees with.
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-4 border-red-500 rounded-xl px-4 py-2 font-mono text-xs text-red-600">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !headline.trim() || !body.trim()}
              className="w-full py-3 bg-yellow-300 border-4 border-black rounded-xl font-black text-sm uppercase shadow-[4px_4px_0_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_black] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? '📡 Transmitting to CJTV...' : '📰 PUBLISH TO CJTV →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
