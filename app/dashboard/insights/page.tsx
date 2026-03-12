"use client"

import { useState, useEffect } from "react"
import { getSupabase } from "@/lib/supabase"
import type { BidLog } from "@/lib/types"

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${Math.round(n)}`
}

export default function InsightsPage() {
  const [bids, setBids] = useState<BidLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = getSupabase()
      const { data } = await supabase
        .from("bid_logs")
        .select("*")
        .order("submitted_date", { ascending: true })
      setBids(data || [])
      setLoading(false)
    }
    load()
  }, [])

  // Category analysis
  const categories = [...new Set(bids.map((b) => b.category))]
  const categoryStats = categories.map((cat) => {
    const catBids = bids.filter((b) => b.category === cat)
    const decided = catBids.filter((b) => b.outcome === "won" || b.outcome === "lost")
    const won = catBids.filter((b) => b.outcome === "won")
    const winRate = decided.length > 0 ? Math.round((won.length / decided.length) * 100) : 0
    const avgBid = catBids.reduce((sum, b) => sum + Number(b.bid_amount), 0) / catBids.length
    const avgWonBid = won.length > 0
      ? won.reduce((sum, b) => sum + Number(b.bid_amount), 0) / won.length
      : 0
    return { cat, total: catBids.length, won: won.length, winRate, avgBid, avgWonBid }
  }).sort((a, b) => b.winRate - a.winRate)

  // Price range analysis
  const ranges = [
    { label: "Under $25K", min: 0, max: 25000 },
    { label: "$25K–$75K", min: 25000, max: 75000 },
    { label: "$75K–$150K", min: 75000, max: 150000 },
    { label: "$150K–$500K", min: 150000, max: 500000 },
    { label: "$500K–$1M", min: 500000, max: 1000000 },
    { label: "Over $1M", min: 1000000, max: Infinity },
  ]

  const priceStats = ranges
    .map((r) => {
      const rb = bids.filter((b) => Number(b.bid_amount) >= r.min && Number(b.bid_amount) < r.max)
      const decided = rb.filter((b) => b.outcome === "won" || b.outcome === "lost")
      const won = rb.filter((b) => b.outcome === "won")
      const winRate = decided.length > 0 ? Math.round((won.length / decided.length) * 100) : 0
      return { ...r, total: rb.length, won: won.length, decided: decided.length, winRate }
    })
    .filter((r) => r.total > 0)

  // Best sweet spot
  const sweetSpot = priceStats.reduce((best, r) =>
    r.decided >= 3 && r.winRate > (best?.winRate || 0) ? r : best,
    null as typeof priceStats[0] | null
  )

  // Competitor analysis
  const compRanges = [
    { label: "1–2", min: 1, max: 2 },
    { label: "3–4", min: 3, max: 4 },
    { label: "5–6", min: 5, max: 6 },
    { label: "7+", min: 7, max: Infinity },
  ]

  const competitorStats = compRanges
    .map((r) => {
      const cb = bids.filter((b) => b.competitor_count !== null && b.competitor_count >= r.min && b.competitor_count <= r.max)
      const decided = cb.filter((b) => b.outcome === "won" || b.outcome === "lost")
      const won = cb.filter((b) => b.outcome === "won")
      const winRate = decided.length > 0 ? Math.round((won.length / decided.length) * 100) : 0
      return { ...r, total: cb.length, won: won.length, decided: decided.length, winRate }
    })
    .filter((r) => r.total > 0)

  // Monthly win rates
  const now = new Date()
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    const monthBids = bids.filter((b) => {
      const bd = new Date(b.submitted_date)
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth()
    })
    const decided = monthBids.filter((b) => b.outcome === "won" || b.outcome === "lost")
    const won = monthBids.filter((b) => b.outcome === "won")
    const winRate = decided.length > 0 ? Math.round((won.length / decided.length) * 100) : 0
    return { label, bids: monthBids.length, won: won.length, decided: decided.length, winRate }
  })

  const overall = {
    decided: bids.filter((b) => b.outcome === "won" || b.outcome === "lost"),
    won: bids.filter((b) => b.outcome === "won"),
  }
  const overallWinRate = overall.decided.length > 0
    ? Math.round((overall.won.length / overall.decided.length) * 100)
    : 0

  const avgWonBid = overall.won.length > 0
    ? overall.won.reduce((sum, b) => sum + Number(b.bid_amount), 0) / overall.won.length
    : 0

  const avgAllBid = bids.length > 0
    ? bids.reduce((sum, b) => sum + Number(b.bid_amount), 0) / bids.length
    : 0

  if (loading) {
    return <div className="p-6 text-gray-400">Analyzing your bids...</div>
  }

  if (bids.length < 3) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <p className="text-5xl mb-4">💡</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Not enough data yet</h2>
          <p className="text-gray-500 mb-6">
            Log at least 3 bids to start seeing insights. The more bids you track, the
            more useful your analytics become.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-500 text-sm mt-1">
          Based on {bids.length} bids · {overall.decided.length} with outcomes
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Overall Win Rate</p>
          <p className="text-3xl font-bold text-indigo-600">{overallWinRate}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {overall.won.length} won / {overall.decided.length} decided
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Avg Winning Bid</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(avgWonBid)}</p>
          <p className="text-xs text-gray-500 mt-1">
            vs {formatCurrency(avgAllBid)} avg all bids
          </p>
        </div>
        {sweetSpot && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-5 shadow-sm">
            <p className="text-sm font-medium text-amber-700 mb-1">Sweet Spot Range</p>
            <p className="text-2xl font-bold text-amber-900">{sweetSpot.label}</p>
            <p className="text-xs text-amber-700 mt-1">{sweetSpot.winRate}% win rate in this range</p>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Win Rate by Category</h2>
          {categoryStats.length === 0 ? (
            <p className="text-gray-400 text-sm">No category data yet</p>
          ) : (
            <div className="space-y-4">
              {categoryStats.map((c) => (
                <div key={c.cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{c.cat}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{c.won}/{c.total}</span>
                      <span className="text-sm font-bold text-gray-900">{c.winRate}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${c.winRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Avg bid: {formatCurrency(c.avgBid)}
                    {c.avgWonBid > 0 && ` · Avg won: ${formatCurrency(c.avgWonBid)}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price range analysis */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Win Rate by Price Range</h2>
          {priceStats.length === 0 ? (
            <p className="text-gray-400 text-sm">No price range data yet</p>
          ) : (
            <div className="space-y-4">
              {priceStats.map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{r.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{r.won}/{r.decided}</span>
                      <span className={`text-sm font-bold ${
                        r.winRate >= 60 ? "text-green-600" :
                        r.winRate >= 30 ? "text-amber-600" :
                        "text-red-500"
                      }`}>
                        {r.decided > 0 ? `${r.winRate}%` : "–"}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        r.winRate >= 60 ? "bg-green-400" :
                        r.winRate >= 30 ? "bg-amber-400" :
                        "bg-red-300"
                      }`}
                      style={{ width: r.decided > 0 ? `${r.winRate}%` : "0%" }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{r.total} total bids</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Competitor analysis */}
      {competitorStats.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Win Rate by Competitor Count</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {competitorStats.map((c) => (
              <div key={c.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{c.label} competitors</p>
                <p className={`text-2xl font-bold ${
                  c.winRate >= 60 ? "text-green-600" :
                  c.winRate >= 30 ? "text-amber-600" :
                  "text-red-500"
                }`}>
                  {c.decided > 0 ? `${c.winRate}%` : "–"}
                </p>
                <p className="text-xs text-gray-400 mt-1">{c.total} bids</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Win Rate Trend</h2>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-3 min-w-full pb-2" style={{ height: "120px" }}>
            {monthlyStats.filter((m) => m.bids > 0).map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1 flex-1 min-w-[40px]">
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(4, m.decided > 0 ? m.winRate : 0)}px`,
                    backgroundColor: m.winRate >= 50 ? "#22c55e" : m.winRate >= 25 ? "#eab308" : "#ef4444",
                    maxHeight: "80px",
                  }}
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{m.label}</span>
                {m.decided > 0 && (
                  <span className="text-xs font-medium text-gray-700">{m.winRate}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
