import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Cockroach Janta Parliament', template: '%s — Cockroach Janta Parliament' },
  description: 'Contest any of 543 Lok Sabha seats as a cockroach. Vote unlimited times. Pure satire. Pure chaos. Every Saturday at 11PM IST, a winner.',
  keywords: ['cockroach parliament', 'satire', 'india politics', 'meme election', 'CJP'],
  openGraph: {
    title: 'Cockroach Janta Parliament 🪳',
    description: '543 seats. Unlimited votes. Zero politicians. Every Saturday, a winner.',
    siteName: 'Cockroach Janta Parliament',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Cockroach Janta Parliament 🪳', description: 'Contest. Vote. Chaos. Every Saturday.' },
  themeColor: '#D4A017',
  manifest: '/manifest.webmanifest',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF7] text-[#1a1a1a]">
        <Navbar />
        {children}
        <Footer />
        {/* Low-fi cockroach scuttle sprites */}
        <span className="roach-sprite" style={{ animationDuration: '18s', animationDelay: '0s',   bottom: '8px'  }}>🪳</span>
        <span className="roach-sprite" style={{ animationDuration: '26s', animationDelay: '-10s', bottom: '28px' }}>🪳</span>
        <span className="roach-sprite" style={{ animationDuration: '21s', animationDelay: '-6s',  bottom: '48px' }}>🪳</span>
        <span className="roach-sprite" style={{ animationDuration: '32s', animationDelay: '-15s', bottom: '64px' }}>🪳</span>
        <span className="roach-sprite" style={{ animationDuration: '15s', animationDelay: '-3s',  bottom: '4px'  }}>🪳</span>
      </body>
    </html>
  )
}
