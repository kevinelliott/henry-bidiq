"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import type { BidLog, BidOutcome } from "@/lib/types"
import StatusBadge from "@/components/StatusBadge"

type SortField = "submitted_date" | "bid_amount" | "client_name" | "outcome"
type SortDir = "asc" | "desc"

const statusFilters: { value: string; label: string }[] = [
  { value: "all", label: "All bids" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "submitted", label: "Submitted" },
  { value: "in-progress", label: "In Progress" },
  { value: "no-bid", label: "No Bid" },
]

export default function BidsPage() {
  const [bids, setBids] = useState<BidLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("submitted_date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  useEffect(() => {
    async function load() {
      const supabase = getSupabase()
      const { data } = await supabase
        .from("bid_logs")
        .select("*")
        .order(sortField, { ascending: sortDir === "asc" })
      setBids(data || [])
      setLoading(false)
    }
    load()
  }, [sortField, sortDir])

  const filtered = bids.filter((b) => {
    const matchesFilter = filter === "all" || b.outcome === filter
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      b.client_name.toLowerCase().includes(q) ||
      b.project_title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-300">↕</span>
    return <span className="text-indigo-600">{sortDir === "asc" ? "↑" : "↓"}</span>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bid Log</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} bid{filtered.length !== 1 ? "s" : ""} shown
          </p>
        </div>
        <Link
          href="/dashboard/bids/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + Log Bid
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search bids..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading bids...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 mb-4">
              {bids.length === 0 ? "No bids logged yet" : "No bids match your filters"}
            </p>
            {bids.length === 0 && (
              <Link
                href="/dashboard/bids/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Log your first bid
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                    onClick={() => toggleSort("client_name")}
                  >
                    Client <SortIcon field="client_name" />
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                    onClick={() => toggleSort("bid_amount")}
                  >
                    Amount <SortIcon field="bid_amount" />
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                    onClick={() => toggleSort("submitted_date")}
                  >
                    Submitted <SortIcon field="submitted_date" />
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                    onClick={() => toggleSort("outcome")}
                  >
                    Status <SortIcon field="outcome" />
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {bid.client_name}
                    </td>
                    <td className="px-6 py-3 text-gray-600 max-w-xs truncate">
                      {bid.project_title}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {bid.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-gray-900 whitespace-nowrap">
                      ${Number(bid.bid_amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                      {bid.submitted_date}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge outcome={bid.outcome as BidOutcome} />
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/dashboard/bids/${bid.id}`}
                        className="text-indigo-600 hover:underline text-xs font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
