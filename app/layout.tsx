import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BidIQ — Know your numbers. Win more bids.",
  description: "Bid win rate analytics for contractors. Track bids, analyze win rates, and discover your pricing sweet spot.",
  keywords: "contractor bid tracking, win rate analytics, bid management, construction bids",
  openGraph: {
    title: "BidIQ — Bid Win Rate Analytics",
    description: "Know your numbers. Win more bids.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
