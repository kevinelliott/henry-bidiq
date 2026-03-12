"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import type { BidLog } from "@/lib/types"
import DonutChart from "@/components/DonutChart"
import Sparkline from "@/components/Sparkline"

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n}`
}

export default function DashboardPage() {
  const [bids, setBids] = useState<BidLog[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.name || user.email?.split("@")[0] || "there")
      }

      const { data } = await supabase
        .from("bid_logs")
        .select("*")
        .order("submitted_date", { ascending: false })

      setBids(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const totalBids = bids.length
  const won = bids.filter((b) => b.outcome === "won").length
  const lost = bids.filter((b) => b.outcome === "lost").length
  const submitted = bids.filter((b) => b.outcome === "submitted").length
  const inProgress = bids.filter((b) => b.outcome === "in-progress").length
  const noBid = bids.filter((b) => b.outcome === "no-bid").length

  const decided = won + lost
  const winRate = decided > 0 ? Math.round((won / decided) * 100) : 0

  const avgBidValue =
    bids.length > 0
      ? bids.reduce((sum, b) => sum + Number(b.bid_amount), 0) / bids.length
      : 0

  const currentYear = new Date().getFullYear()
  const revenueWonYTD = bids
    .filter(
      (b) =>
        b.outcome === "won" &&
        b.decision_date &&
        new Date(b.decision_date).getFullYear() === currentYear
    )
    .reduce((sum, b) => sum + Number(b.award_amount || b.bid_amount), 0)

  // Sparkline: monthly win counts over last 6 months
  const now = new Date()
  const trend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const y = d.getFullYear()
    const m = d.getMonth()
    return bids.filter((b) => {
      if (b.outcome !== "won" || !b.decision_date) return false
      const bd = new Date(b.decision_date)
      return bd.getFullYear() === y && bd.getMonth() === m
    }).length
  })

  const recentBids = bids.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {userName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here&apos;s your bid performance overview
          </p>
        </div>
        <Link
          href="/dashboard/bids/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + Log New Bid
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Bids</p>
          <p className="text-3xl font-bold text-gray-900">{totalBids}</p>
          <div className="mt-2">
            <Sparkline data={trend.map((_, i) => bids.filter((b) => {
              const d = new Date()
              const mon = new Date(d.getFullYear(), d.getMonth() - (5 - i), 1)
              const bd = new Date(b.submitted_date)
              return bd.getFullYear() === mon.getFullYear() && bd.getMonth() === mon.getMonth()
            }).length)} color="#6366f1" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Win Rate</p>
          <p className="text-3xl font-bold text-green-600">{winRate}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {won} won of {decided} decided
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Avg Bid Value</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(avgBidValue)}</p>
          <p className="text-xs text-gray-500 mt-1">Across all bids</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Revenue Won YTD</p>
          <p className="text-3xl font-bold text-indigo-600">{formatCurrency(revenueWonYTD)}</p>
          <p className="text-xs text-gray-500 mt-1">This calendar year</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Bid Outcomes</h2>
          {totalBids > 0 ? (
            <DonutChart
              won={won}
              lost={lost}
              submitted={submitted}
              inProgress={inProgress}
              noBid={noBid}
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-sm">No bids logged yet</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/dashboard/bids" className="text-xs text-indigo-600 hover:underline">
              View all →
            </Link>
          </div>

          {recentBids.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🚀</p>
              <p className="text-gray-500 mb-4">No bids logged yet. Start tracking your bids!</p>
              <Link
                href="/dashboard/bids/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Log your first bid
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBids.map((bid) => (
                <Link
                  key={bid.id}
                  href={`/dashboard/bids/${bid.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{bid.project_title}</p>
                    <p className="text-xs text-gray-500">{bid.client_name} · {bid.submitted_date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="font-mono text-sm text-gray-700">
                      ${Number(bid.bid_amount).toLocaleString()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      bid.outcome === "won" ? "bg-green-100 text-green-800" :
                      bid.outcome === "lost" ? "bg-red-100 text-red-800" :
                      bid.outcome === "submitted" ? "bg-blue-100 text-blue-800" :
                      bid.outcome === "in-progress" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {bid.outcome}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/insights"
          className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 hover:border-indigo-200 transition-colors"
        >
          <div className="text-2xl mb-2">💡</div>
          <div className="font-semibold text-gray-900">View Insights</div>
          <div className="text-sm text-gray-500 mt-1">Win rate by category, price sweet spot</div>
        </Link>
        <Link
          href="/dashboard/bids/new"
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 hover:border-green-200 transition-colors"
        >
          <div className="text-2xl mb-2">➕</div>
          <div className="font-semibold text-gray-900">Log a Bid</div>
          <div className="text-sm text-gray-500 mt-1">Add a new bid to your log</div>
        </Link>
        <Link
          href="/dashboard/settings"
          className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors"
        >
          <div className="text-2xl mb-2">⚙️</div>
          <div className="font-semibold text-gray-900">Settings</div>
          <div className="text-sm text-gray-500 mt-1">Account, billing, preferences</div>
        </Link>
      </div>
    </div>
  )
}
