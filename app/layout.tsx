import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cockroach Janta Parliament',
  description:
    'A satirical online parliament where anyone in India can contest any of 543 Lok Sabha seats under auto-generated cockroach identities. Vote unlimited. No friction. Pure chaos.',
  openGraph: {
    title: 'Cockroach Janta Parliament',
    description: 'Contest. Vote. Chaos. Every Saturday.',
    siteName: 'Cockroach Janta Parliament',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cockroach Janta Parliament',
    description: 'Contest. Vote. Chaos. Every Saturday.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF7] text-[#1a1a1a]">
        {children}
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
