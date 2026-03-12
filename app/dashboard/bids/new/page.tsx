"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase"

const CATEGORIES = [
  "Construction",
  "Service",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Civil",
  "Roofing",
  "Landscaping",
  "IT / Technology",
  "Consulting",
  "Other",
]

const OUTCOMES = [
  { value: "in-progress", label: "In Progress" },
  { value: "submitted", label: "Submitted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "no-bid", label: "No Bid" },
]

export default function NewBidPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    client_name: "",
    project_title: "",
    category: "Construction",
    bid_amount: "",
    competitor_count: "",
    submitted_date: new Date().toISOString().split("T")[0],
    decision_date: "",
    outcome: "in-progress",
    award_amount: "",
    notes: "",
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const payload = {
        user_id: user.id,
        client_name: form.client_name,
        project_title: form.project_title,
        category: form.category,
        bid_amount: parseFloat(form.bid_amount),
        competitor_count: form.competitor_count ? parseInt(form.competitor_count) : null,
        submitted_date: form.submitted_date,
        decision_date: form.decision_date || null,
        outcome: form.outcome,
        award_amount: form.award_amount ? parseFloat(form.award_amount) : null,
        notes: form.notes || null,
      }

      const { error: insertError } = await supabase.from("bid_logs").insert(payload)

      if (insertError) {
        setError(insertError.message)
      } else {
        router.push("/dashboard/bids")
      }
    } catch {
      setError("Failed to save bid. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/bids"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Log a New Bid</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={form.client_name}
                onChange={(e) => update("client_name", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={form.project_title}
              onChange={(e) => update("project_title", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="HVAC Renovation Building A"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bid Amount ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.bid_amount}
                onChange={(e) => update("bid_amount", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="125000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Competitor Count
              </label>
              <input
                type="number"
                min="0"
                value={form.competitor_count}
                onChange={(e) => update("competitor_count", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Submitted *
              </label>
              <input
                type="date"
                required
                value={form.submitted_date}
                onChange={(e) => update("submitted_date", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={form.outcome}
                onChange={(e) => update("outcome", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {OUTCOMES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {(form.outcome === "won" || form.outcome === "lost") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decision Date
                </label>
                <input
                  type="date"
                  value={form.decision_date}
                  onChange={(e) => update("decision_date", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {form.outcome === "won" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Award Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.award_amount}
                    onChange={(e) => update("award_amount", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Same as bid amount"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Any additional context about this bid..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : "Save Bid"}
            </button>
            <Link
              href="/dashboard/bids"
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
