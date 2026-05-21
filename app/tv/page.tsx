import Link from 'next/link'
import type { Metadata } from 'next'
import { NEWS_ARTICLES, CATEGORY_COLORS, type NewsArticle } from '@/lib/newsArticles'

export const metadata: Metadata = {
  title: 'Cockroach Janta TV — Breaking Drain News',
  description: 'India\'s only cockroach-run news channel. All the corruption, drama, and drain politics you didn\'t know you needed.',
}

// ── Set your YouTube live stream / video ID here ─────────────────────────────
// e.g. 'dQw4w9WgXcQ'  (the part after youtube.com/watch?v=)
const CJTV_YOUTUBE_ID = ''

// ── Cockroach cover images (public domain, Wikimedia Commons) ─────────────────
const COVER_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/4/4c/American_cockroach.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Periplaneta_americana_Male.jpg/800px-Periplaneta_americana_Male.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Blatta_orientalis_couple.jpg/800px-Blatta_orientalis_couple.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Blattodea_bg.jpg/800px-Blattodea_bg.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Madagascar_cockroach.jpg/800px-Madagascar_cockroach.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Periplaneta_americana2.jpg/800px-Periplaneta_americana2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Blaberus_discoidalis_female.jpg/800px-Blaberus_discoidalis_female.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Cockroach_closeup.jpg/800px-Cockroach_closeup.jpg',
]

function getCover(index: number) {
  return COVER_IMAGES[index % COVER_IMAGES.length]
}

function timeAgo(iso: string) {
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function CategoryBadge({ category }: { category: NewsArticle['category'] }) {
  return (
    <span
      className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm text-white"
      style={{ background: CATEGORY_COLORS[category] }}
    >
      {category}
    </span>
  )
}

function ArticleCard({
  article,
  size = 'sm',
  imgSrc,
}: {
  article: NewsArticle
  size?: 'sm' | 'md' | 'lg'
  imgSrc?: string
}) {
  if (size === 'lg') {
    return (
      <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[5px_5px_0_black] bg-white group cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_black] transition-all">
        {/* Hero image */}
        <div
          className="w-full h-56 relative overflow-hidden"
          style={{ background: `${CATEGORY_COLORS[article.category]}15`, borderBottom: `4px solid ${CATEGORY_COLORS[article.category]}` }}
        >
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={article.headline}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          {/* Cockroach watermark overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-[100px] opacity-[0.08] select-none pointer-events-none z-10">🪳</div>
          {/* Dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          <div className="absolute bottom-4 left-5 z-20 flex flex-col gap-2">
            <CategoryBadge category={article.category} />
            {article.isHot && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-black text-yellow-300 px-2 py-0.5 rounded-sm w-fit">
                🔥 HOT
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h2 className="font-black text-xl text-black leading-tight mb-2 group-hover:text-[#7F77DD] transition-colors">
            {article.headline}
          </h2>
          <p className="text-xs text-black/50 font-mono mb-3 italic">{article.subheadline}</p>
          <p className="text-sm text-black/70 font-mono leading-relaxed mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between text-[10px] text-black/40 font-mono border-t border-black/10 pt-3">
            <span>✍️ {article.author} · {article.authorRole.split(',')[0]}</span>
            <span>{timeAgo(article.publishedAt)} · {article.readMinutes} min read</span>
          </div>
        </div>
      </div>
    )
  }

  if (size === 'md') {
    return (
      <div className="border-4 border-black rounded-xl overflow-hidden shadow-[3px_3px_0_black] bg-white group cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_black] transition-all flex flex-col">
        <div
          className="h-32 relative overflow-hidden"
          style={{ background: `${CATEGORY_COLORS[article.category]}18`, borderBottom: `3px solid ${CATEGORY_COLORS[article.category]}` }}
        >
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={article.headline}
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-[0.12] select-none z-10">🪳</div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <div className="absolute bottom-3 left-4 z-20">
            <CategoryBadge category={article.category} />
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-black text-sm text-black leading-tight mb-1.5 group-hover:text-[#7F77DD] transition-colors flex-1">
            {article.headline}
          </h3>
          <p className="text-[10px] text-black/40 font-mono mt-2">
            {article.author} · {timeAgo(article.publishedAt)}
          </p>
        </div>
      </div>
    )
  }

  // sm
  return (
    <div className="flex gap-3 items-start py-3 border-b border-black/10 group cursor-pointer">
      <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden relative" style={{ background: `${CATEGORY_COLORS[article.category]}20` }}>
        {imgSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center text-xl z-10">🪳</div>
      </div>
      <div className="flex-1 min-w-0">
        <CategoryBadge category={article.category} />
        <h4 className="font-black text-xs text-black leading-tight mt-1 group-hover:text-[#7F77DD] transition-colors line-clamp-2">
          {article.headline}
        </h4>
        <p className="text-[9px] text-black/35 font-mono mt-0.5">{timeAgo(article.publishedAt)}</p>
      </div>
    </div>
  )
}

function FullArticle({ article, imgSrc }: { article: NewsArticle; imgSrc?: string }) {
  return (
    <article className="border-4 border-black rounded-2xl bg-white shadow-[5px_5px_0_black] overflow-hidden mb-6">
      {/* Full-width article image */}
      {imgSrc && (
        <div className="w-full h-48 relative overflow-hidden" style={{ borderBottom: `4px solid ${CATEGORY_COLORS[article.category]}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={article.headline}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-5 flex items-center gap-2">
            <CategoryBadge category={article.category} />
            {article.isHot && <span className="text-[9px] font-black bg-black text-yellow-300 px-2 py-0.5 rounded-sm">🔥 HOT</span>}
          </div>
        </div>
      )}
      {/* Article header */}
      <div className="px-6 pt-6 pb-5 border-b-4 border-black" style={{ background: `${CATEGORY_COLORS[article.category]}12` }}>
        {!imgSrc && (
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={article.category} />
            {article.isHot && <span className="text-[9px] font-black bg-black text-yellow-300 px-2 py-0.5 rounded-sm">🔥 HOT</span>}
            {article.isFeatured && <span className="text-[9px] font-black bg-yellow-300 text-black px-2 py-0.5 rounded-sm border-2 border-black">⭐ FEATURED</span>}
          </div>
        )}
        {imgSrc && (
          <div className="flex items-center gap-2 mb-3">
            {article.isFeatured && <span className="text-[9px] font-black bg-yellow-300 text-black px-2 py-0.5 rounded-sm border-2 border-black">⭐ FEATURED</span>}
          </div>
        )}
        <h2 className="font-black text-2xl text-black leading-tight mb-2">{article.headline}</h2>
        <p className="text-sm text-black/50 font-mono italic mb-3">{article.subheadline}</p>
        <div className="flex items-center gap-3 text-[10px] text-black/40 font-mono">
          <span>✍️ <strong className="text-black/60">{article.author}</strong></span>
          <span>·</span>
          <span>{article.authorRole}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span>·</span>
          <span>{article.readMinutes} min read</span>
        </div>
      </div>
      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {article.body.map((para, i) => (
          <p key={i} className="text-sm text-black/80 font-mono leading-relaxed">
            {i === 0 && (
              <span className="float-left font-black text-5xl leading-none mr-2 mt-1" style={{ color: CATEGORY_COLORS[article.category] }}>
                {para[0]}
              </span>
            )}
            {i === 0 ? para.slice(1) : para}
          </p>
        ))}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-black/10">
          {article.tags.map(t => (
            <span key={t} className="text-[9px] font-mono text-black/40 bg-black/5 px-2 py-0.5 rounded-full border border-black/10">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function TVPage() {
  const featured = NEWS_ARTICLES[0]
  const top3 = NEWS_ARTICLES.slice(1, 4)
  const grid6 = NEWS_ARTICLES.slice(4, 10)
  const remaining = NEWS_ARTICLES.slice(10)
  const sidebar = NEWS_ARTICLES.filter(a => a.isHot).slice(0, 5)

  const TICKER = [
    '🔴 BREAKING: Vote count crosses 5 lakh mark — servers sweating',
    '📢 ACP files 47th petition against CJP today alone',
    '🪳 Roti bribery case: ED raids Mohalla Dhaba #4',
    '🏛️ Supreme Court: "We are not a cockroach restaurant, stop coming here for everything"',
    '🗳️ EC extends voting deadline after drain floods delay 3,847 voters',
    '💬 CJP MP suspended for saying "drain" too many times during energy debate',
    '📺 CJTV rated #1 news channel among cockroaches aged 0-300 million years',
    '🔴 BREAKING: 12,847 candidates filed — new Cockroach Parliament record',
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F0]">

      {/* ── CJTV HEADER ── */}
      <div className="bg-black border-b-8 border-yellow-300 sticky top-[56px] z-40">
        {/* Channel branding */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">📺</span>
            <div>
              <div className="font-black text-yellow-300 text-xl uppercase leading-none tracking-tight">
                Cockroach Janta TV
              </div>
              <div className="text-white/30 font-mono text-[9px] tracking-widest uppercase">
                India&apos;s Only Cockroach-Run News Channel · Est. 2026
              </div>
            </div>
            <span className="ml-3 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              LIVE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
            <span className="text-white/70 hover:text-yellow-300 cursor-pointer transition-colors">Politics</span>
            <span className="text-white/70 hover:text-yellow-300 cursor-pointer transition-colors">Court</span>
            <span className="text-white/70 hover:text-yellow-300 cursor-pointer transition-colors">Investigation</span>
            <span className="text-white/70 hover:text-yellow-300 cursor-pointer transition-colors">Opinion</span>
            <Link href="/" className="bg-yellow-300 text-black px-3 py-1 rounded-lg hover:bg-white transition-colors">
              ← Parliament
            </Link>
          </div>
        </div>

        {/* TICKER */}
        <div className="border-t border-yellow-300/20 bg-yellow-300/5 overflow-hidden">
          <div className="flex items-center">
            <div className="shrink-0 bg-red-600 text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest">
              BREAKING
            </div>
            <div className="overflow-hidden flex-1 py-1">
              <div className="ticker-track text-yellow-300/70 font-mono text-[10px]">
                {[...TICKER, ...TICKER].map((item, i) => (
                  <span key={i} className="mx-10 shrink-0">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── TOP FEATURED + SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Main featured */}
          <div className="lg:col-span-2">
            <ArticleCard article={featured} size="lg" imgSrc={getCover(0)} />
          </div>

          {/* Side top-3 */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-black/30 border-b-2 border-black pb-1">
              Top Stories
            </div>
            {top3.map((a, i) => (
              <ArticleCard key={a.id} article={a} size="md" imgSrc={getCover(i + 1)} />
            ))}
          </div>
        </div>

        {/* ── LIVE TV SECTION ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              LIVE TV
            </span>
            <div className="flex-1 h-[3px] bg-black" />
            <span className="font-black text-xs uppercase tracking-widest px-3">CJTV Live Stream</span>
            <div className="flex-1 h-[3px] bg-black" />
          </div>

          <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0_black] bg-black">
            {/* Video area - 16:9 */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {CJTV_YOUTUBE_ID ? (
                <iframe
                  src={`https://www.youtube.com/embed/${CJTV_YOUTUBE_ID}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="CJTV Live"
                />
              ) : (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/cjtv-live.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              )}
            </div>

            {/* Video footer */}
            <div className="px-5 py-3 flex items-center justify-between bg-[#111] border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-red-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                  {CJTV_YOUTUBE_ID ? 'LIVE NOW' : 'NOW PLAYING'}
                </span>
                <span className="text-white/30 font-mono text-[9px]">📺 Cockroach Janta TV · Est. 2026</span>
              </div>
              <a
                href={CJTV_YOUTUBE_ID
                  ? `https://www.youtube.com/watch?v=${CJTV_YOUTUBE_ID}`
                  : 'https://www.youtube.com/@cockroachparliament'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors"
              >
                ▶ Watch on YouTube →
              </a>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1 bg-black" />
          <span className="font-black text-xs uppercase tracking-widest px-3">Latest from CJTV</span>
          <div className="flex-1 h-1 bg-black" />
        </div>

        {/* ── MAIN GRID + SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Articles grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* 2-col card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {grid6.map((a, i) => (
                <ArticleCard key={a.id} article={a} size="md" imgSrc={getCover(i + 4)} />
              ))}
            </div>

            {/* Full articles */}
            <div className="text-[10px] font-black uppercase tracking-widest text-black/30 border-b-2 border-black pb-1 mb-4">
              Full Reports
            </div>
            {remaining.map((a, i) => (
              <FullArticle key={a.id} article={a} imgSrc={getCover(i + 10)} />
            ))}
          </div>

          {/* Sticky sidebar */}
          <aside className="space-y-6">

            {/* Hot stories */}
            <div className="border-4 border-black rounded-xl bg-white shadow-[4px_4px_0_black] p-4">
              <div className="font-black text-xs uppercase tracking-widest border-b-2 border-black pb-2 mb-3 flex items-center gap-2">
                🔥 Hot Right Now
              </div>
              {sidebar.map((a, i) => (
                <ArticleCard key={a.id} article={a} size="sm" imgSrc={getCover(i + 5)} />
              ))}
            </div>

            {/* Vote CTA */}
            <div className="border-4 border-yellow-300 rounded-xl bg-yellow-300 shadow-[4px_4px_0_black] p-4 text-center">
              <div className="text-3xl mb-2">🪳</div>
              <div className="font-black text-black text-sm uppercase leading-tight mb-2">
                Stop reading.<br />Start contesting.
              </div>
              <p className="text-black/60 font-mono text-[10px] mb-3">543 seats · unlimited votes · zero chill</p>
              <Link
                href="/file"
                className="inline-block w-full py-2.5 bg-black text-yellow-300 font-black text-sm rounded-xl border-4 border-black hover:bg-[#7F77DD] hover:border-[#7F77DD] transition-colors"
              >
                CONTEST NOW →
              </Link>
            </div>

            {/* Categories */}
            <div className="border-4 border-black rounded-xl bg-white shadow-[4px_4px_0_black] p-4">
              <div className="font-black text-xs uppercase tracking-widest border-b-2 border-black pb-2 mb-3">
                Browse by Category
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['BREAKING', 'EXCLUSIVE', 'OPINION', 'INVESTIGATION', 'POLITICS', 'COURT', 'EC', 'INTERNATIONAL'] as const).map(cat => (
                  <span
                    key={cat}
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg text-white cursor-pointer hover:scale-105 transition-transform"
                    style={{ background: CATEGORY_COLORS[cat] }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="border-4 border-black rounded-xl bg-black text-white shadow-[4px_4px_0_black] p-4">
              <div className="font-black text-xs uppercase tracking-widest text-yellow-300 border-b border-white/10 pb-2 mb-3">
                📺 CJTV Stats
              </div>
              {[
                { label: 'Stories published', value: `${NEWS_ARTICLES.length}` },
                { label: 'Drains covered', value: '543' },
                { label: 'Roti bribes exposed', value: '1' },
                { label: 'MPs suspended on-air', value: '198' },
                { label: 'Petitions filed by us', value: '47' },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-[10px] font-mono py-1 border-b border-white/5">
                  <span className="text-white/50">{s.label}</span>
                  <span className="font-black text-yellow-300">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Instagram CTA */}
            <a
              href="https://www.instagram.com/cockroachparliament_official"
              target="_blank"
              rel="noopener noreferrer"
              className="border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0_black] flex flex-col items-center gap-2 p-4 text-center hover:scale-[1.02] transition-transform block"
              style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}
            >
              <span className="text-3xl">📸</span>
              <p className="font-black text-white text-sm uppercase">Follow CJTV on Instagram</p>
              <p className="text-white/70 font-mono text-[9px]">@cockroachparliament_official</p>
            </a>
          </aside>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t-8 border-black bg-black text-white py-6 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-white/30">
          <span>📺 Cockroach Janta TV · Est. 2026 · All satire, all the time</span>
          <span>Not affiliated with any actual cockroach, drain, or political party</span>
          <Link href="/" className="text-yellow-300/50 hover:text-yellow-300">← Back to Parliament</Link>
        </div>
      </div>
    </div>
  )
}
