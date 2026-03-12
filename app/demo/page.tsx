"use client"

import Link from "next/link"
import Nav from "@/components/Nav"
import DonutChart from "@/components/DonutChart"
import StatusBadge from "@/components/StatusBadge"

const demoBids = [
  { id: 1, client: "City of Portland", project: "Water Main Replacement Phase 2", category: "Construction", amount: 487000, submitted: "2024-09-03", decision: "2024-10-15", outcome: "won", competitors: 4 },
  { id: 2, client: "Tri-County School District", project: "HVAC Renovation Building C", category: "Service", amount: 92500, submitted: "2024-09-10", decision: "2024-10-01", outcome: "won", competitors: 3 },
  { id: 3, client: "Riverside Mall LLC", project: "Parking Lot Resurfacing", category: "Construction", amount: 214000, submitted: "2024-08-22", decision: "2024-09-15", outcome: "lost", competitors: 6 },
  { id: 4, client: "Morrison Medical Center", project: "Electrical Panel Upgrades", category: "Service", amount: 67800, submitted: "2024-09-18", decision: "2024-10-05", outcome: "won", competitors: 2 },
  { id: 5, client: "Pine Ridge Apartments", project: "Roof Replacement 3 Buildings", category: "Construction", amount: 342000, submitted: "2024-07-15", decision: "2024-08-10", outcome: "lost", competitors: 7 },
  { id: 6, client: "Jefferson County", project: "Bridge Inspection Services", category: "Service", amount: 45000, submitted: "2024-09-25", decision: "2024-10-20", outcome: "won", competitors: 3 },
  { id: 7, client: "TechCorp Campus", project: "Data Center Cooling System", category: "Construction", amount: 890000, submitted: "2024-08-05", decision: "2024-09-30", outcome: "lost", competitors: 5 },
  { id: 8, client: "Oakwood Senior Living", project: "Plumbing Renovation Phase 1", category: "Service", amount: 128500, submitted: "2024-09-01", decision: "2024-09-22", outcome: "won", competitors: 4 },
  { id: 9, client: "Harbor View Hotel", project: "Fire Suppression Upgrade", category: "Service", amount: 78000, submitted: "2024-08-14", decision: "2024-09-08", outcome: "won", competitors: 3 },
  { id: 10, client: "Metro Transit Authority", project: "Bus Depot Facility Expansion", category: "Construction", amount: 1250000, submitted: "2024-07-01", decision: "2024-09-15", outcome: "lost", competitors: 8 },
  { id: 11, client: "Sunset Elementary School", project: "Playground Installation", category: "Construction", amount: 87000, submitted: "2024-09-05", decision: "2024-09-28", outcome: "won", competitors: 5 },
  { id: 12, client: "Pacific Northwest Brewery", project: "Waste Treatment System", category: "Service", amount: 156000, submitted: "2024-08-20", decision: "2024-09-25", outcome: "submitted", competitors: 3 },
  { id: 13, client: "Downtown Business Assoc.", project: "Street Lighting Replacement", category: "Construction", amount: 320000, submitted: "2024-10-01", decision: null, outcome: "in-progress", competitors: null },
  { id: 14, client: "Valley Medical Group", project: "Generator Installation", category: "Service", amount: 94000, submitted: "2024-09-12", decision: "2024-10-08", outcome: "won", competitors: 4 },
  { id: 15, client: "Cascade Shopping Center", project: "Elevator Modernization", category: "Service", amount: 215000, submitted: "2024-08-28", decision: "2024-09-20", outcome: "lost", competitors: 5 },
  { id: 16, client: "Columbia River Port", project: "Dock Reinforcement", category: "Construction", amount: 445000, submitted: "2024-07-20", decision: "2024-08-25", outcome: "won", competitors: 4 },
  { id: 17, client: "Green Valley HOA", project: "Irrigation System Overhaul", category: "Service", amount: 38500, submitted: "2024-09-15", decision: "2024-10-01", outcome: "won", competitors: 2 },
  { id: 18, client: "Pacific Energy Corp", project: "Substation Civil Work", category: "Construction", amount: 2100000, submitted: "2024-06-15", decision: "2024-09-01", outcome: "lost", competitors: 9 },
  { id: 19, client: "Willamette Valley Winery", project: "Facility Expansion", category: "Construction", amount: 178000, submitted: "2024-09-08", decision: "2024-09-30", outcome: "won", competitors: 6 },
  { id: 20, client: "North Portland YMCA", project: "Pool Equipment Replacement", category: "Service", amount: 62000, submitted: "2024-10-02", decision: null, outcome: "submitted", competitors: 3 },
]

const categoryData = [
  { category: "Service", bids: 24, won: 13, winRate: 52, avgBid: 91000 },
  { category: "Construction", bids: 23, won: 6, winRate: 26, avgBid: 163000 },
]

const monthlyData = [
  { month: "Apr", bids: 3, won: 1 },
  { month: "May", bids: 4, won: 1 },
  { month: "Jun", bids: 3, won: 0 },
  { month: "Jul", bids: 5, won: 1 },
  { month: "Aug", bids: 6, won: 2 },
  { month: "Sep", bids: 8, won: 6 },
  { month: "Oct", bids: 5, won: 3 },
  { month: "Nov", bids: 4, won: 2 },
  { month: "Dec", bids: 3, won: 1 },
  { month: "Jan", bids: 4, won: 1 },
  { month: "Feb", bids: 3, won: 1 },
  { month: "Mar", bids: 4, won: 2 },
]

const priceRangeData = [
  { range: "< $50K", bids: 4, won: 2, winRate: 50 },
  { range: "$50K–$150K", bids: 18, won: 12, winRate: 67 },
  { range: "$150K–$500K", bids: 14, won: 4, winRate: 29 },
  { range: "$500K+", bids: 11, won: 2, winRate: 18 },
]

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n}`
}

export default function DemoPage() {
  const won = demoBids.filter((b) => b.outcome === "won").length
  const lost = demoBids.filter((b) => b.outcome === "lost").length
  const submitted = demoBids.filter((b) => b.outcome === "submitted").length
  const inProgress = demoBids.filter((b) => b.outcome === "in-progress").length

  const maxBar = Math.max(...monthlyData.map((m) => m.bids))

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      {/* Demo banner */}
      <div className="bg-indigo-600 text-white text-center py-2.5 px-4 text-sm font-medium">
        Demo Mode — Morrison Construction Group &bull; 18-month bid history &bull;{" "}
        <Link href="/auth/signup" className="underline hover:no-underline">
          Create your free account →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Morrison Construction Group</h1>
            <p className="text-gray-500 text-sm mt-1">April 2023 – March 2025 &bull; 47 total bids</p>
          </div>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Pro Plan
            </span>
            <Link
              href="/auth/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Use with your data
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bids", value: "47", sub: "Last 18 months", color: "text-gray-900" },
            { label: "Win Rate", value: "34%", sub: "↑ 6% vs prior period", color: "text-green-600" },
            { label: "Avg Bid Value", value: "$127K", sub: "Median: $94K", color: "text-gray-900" },
            { label: "Revenue Won YTD", value: "$1.8M", sub: "16 projects won", color: "text-indigo-600" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</p>
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Donut */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Bid Outcomes</h2>
            <DonutChart
              won={won}
              lost={lost}
              submitted={submitted}
              inProgress={inProgress}
              noBid={0}
              size={220}
            />
          </div>

          {/* Monthly bar chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Activity</h2>
            <div className="flex items-end gap-2 h-32">
              {monthlyData.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: "100px" }}>
                    {/* Won */}
                    <div
                      className="w-full bg-green-400 rounded-sm"
                      style={{ height: `${(m.won / maxBar) * 100}px` }}
                    />
                    {/* Lost */}
                    <div
                      className="w-full bg-red-200 rounded-sm"
                      style={{ height: `${((m.bids - m.won) / maxBar) * 100}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-400 rounded-sm" />
                <span className="text-xs text-gray-600">Won</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-200 rounded-sm" />
                <span className="text-xs text-gray-600">Lost</span>
              </div>
            </div>

            {/* Best month callout */}
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="text-sm font-medium text-amber-900">
                🏆 Best month: September — 6 wins from 8 bids (75% win rate)
              </p>
            </div>
          </div>
        </div>

        {/* Category breakdown + price sweet spot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Win Rate by Category</h2>
            <div className="space-y-4">
              {categoryData.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{cat.won}/{cat.bids} bids</span>
                      <span className="text-sm font-bold text-gray-900">{cat.winRate}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${cat.winRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Avg bid: {formatCurrency(cat.avgBid)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 <strong>Insight:</strong> Service bids win at 2× the rate of construction bids.
                Consider prioritizing service work when competing against multiple bidders.
              </p>
            </div>
          </div>

          {/* Price sweet spot */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Price Sweet Spot</h2>
            <div className="space-y-4">
              {priceRangeData.map((r) => (
                <div key={r.range}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{r.range}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{r.won}/{r.bids} bids</span>
                      <span
                        className={`text-sm font-bold ${
                          r.winRate >= 60
                            ? "text-green-600"
                            : r.winRate >= 30
                            ? "text-amber-600"
                            : "text-red-500"
                        }`}
                      >
                        {r.winRate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        r.winRate >= 60
                          ? "bg-green-400"
                          : r.winRate >= 30
                          ? "bg-amber-400"
                          : "bg-red-300"
                      }`}
                      style={{ width: `${r.winRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3">
              <p className="text-sm text-green-900">
                💡 <strong>Sweet spot:</strong> $50K–$150K bids win at 67% — 3.7× better than
                bids over $500K. Focus here for reliable revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Key insights */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-indigo-700 mb-1">26%</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Below market on wins</div>
              <div className="text-xs text-gray-600">
                Your winning bids average 26% below market rate. This suggests room to increase prices
                on lower-competition bids.
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700 mb-1">75%</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Win rate vs. 2 competitors</div>
              <div className="text-xs text-gray-600">
                When only 2 competitors are bidding, you win 75% of the time. Aggressively pursue
                opportunities with fewer bidders.
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-700 mb-1">Sep–Oct</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Your peak winning season</div>
              <div className="text-xs text-gray-600">
                September and October historically account for 43% of your annual wins. Submit
                your strongest bids in Q3.
              </div>
            </div>
          </div>
        </div>

        {/* Bid log table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Bids</h2>
            <span className="text-sm text-gray-500">Showing 20 of 47 bids</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bid Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {demoBids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">{bid.client}</td>
                    <td className="px-6 py-3 text-gray-600 max-w-xs truncate">{bid.project}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        bid.category === "Service"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-orange-50 text-orange-700"
                      }`}>
                        {bid.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-gray-900 whitespace-nowrap">
                      {formatCurrency(bid.amount)}
                    </td>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{bid.submitted}</td>
                    <td className="px-6 py-3">
                      <StatusBadge outcome={bid.outcome} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to see your own numbers?</h2>
          <p className="text-indigo-100 mb-6">
            Create your free account and start tracking bids in 2 minutes.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            Start free today
          </Link>
        </div>
      </div>
    </div>
  )
}
