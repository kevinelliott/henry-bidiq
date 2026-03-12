"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import type { BidLog, BidOutcome } from "@/lib/types"
import StatusBadge from "@/components/StatusBadge"

const OUTCOMES = [
  { value: "in-progress", label: "In Progress" },
  { value: "submitted", label: "Submitted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "no-bid", label: "No Bid" },
]

interface PageProps {
  params: { id: string }
}

export default function BidDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [bid, setBid] = useState<BidLog | null>(null)
  const [similarBids, setSimilarBids] = useState<BidLog[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [editForm, setEditForm] = useState({
    outcome: "",
    decision_date: "",
    award_amount: "",
    notes: "",
  })

  useEffect(() => {
    async function load() {
      const supabase = getSupabase()
      const { data } = await supabase
        .from("bid_logs")
        .select("*")
        .eq("id", params.id)
        .single()

      if (data) {
        setBid(data)
        setEditForm({
          outcome: data.outcome,
          decision_date: data.decision_date || "",
          award_amount: data.award_amount ? String(data.award_amount) : "",
          notes: data.notes || "",
        })

        // Load similar bids (same category)
        const { data: similar } = await supabase
          .from("bid_logs")
          .select("*")
          .eq("category", data.category)
          .neq("id", params.id)
          .limit(5)

        setSimilarBids(similar || [])
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleSave() {
    if (!bid) return
    setSaving(true)
    setError(null)

    try {
      const supabase = getSupabase()
      const { error: updateError } = await supabase
        .from("bid_logs")
        .update({
          outcome: editForm.outcome,
          decision_date: editForm.decision_date || null,
          award_amount: editForm.award_amount ? parseFloat(editForm.award_amount) : null,
          notes: editForm.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bid.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        setBid({
          ...bid,
          outcome: editForm.outcome as BidOutcome,
          decision_date: editForm.decision_date || null,
          award_amount: editForm.award_amount ? parseFloat(editForm.award_amount) : null,
          notes: editForm.notes || null,
        })
        setEditing(false)
      }
    } catch {
      setError("Failed to update bid.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!bid || !confirm("Delete this bid? This cannot be undone.")) return
    setDeleting(true)

    try {
      const supabase = getSupabase()
      await supabase.from("bid_logs").delete().eq("id", bid.id)
      router.push("/dashboard/bids")
    } catch {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-400">Loading bid...</div>
  }

  if (!bid) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Bid not found</p>
        <Link href="/dashboard/bids" className="text-indigo-600 hover:underline">
          ← Back to bids
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/bids" className="text-gray-400 hover:text-gray-600">
          ← Bid Log
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium truncate">{bid.project_title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main bid card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{bid.project_title}</h1>
                <p className="text-gray-500 text-sm mt-1">{bid.client_name}</p>
              </div>
              <StatusBadge outcome={bid.outcome} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                <p className="font-semibold text-gray-900">${Number(bid.bid_amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-semibold text-gray-900">{bid.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Competitors</p>
                <p className="font-semibold text-gray-900">{bid.competitor_count ?? "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Submitted</p>
                <p className="font-semibold text-gray-900">{bid.submitted_date}</p>
              </div>
              {bid.decision_date && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Decision Date</p>
                  <p className="font-semibold text-gray-900">{bid.decision_date}</p>
                </div>
              )}
              {bid.award_amount && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Award Amount</p>
                  <p className="font-semibold text-green-600">${Number(bid.award_amount).toLocaleString()}</p>
                </div>
              )}
            </div>

            {bid.notes && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{bid.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {editing ? "Cancel Edit" : "Edit Outcome"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Update Bid</h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.outcome}
                    onChange={(e) => setEditForm((f) => ({ ...f, outcome: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {OUTCOMES.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Decision Date</label>
                  <input
                    type="date"
                    value={editForm.decision_date}
                    onChange={(e) => setEditForm((f) => ({ ...f, decision_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {editForm.outcome === "won" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Award Amount ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.award_amount}
                      onChange={(e) => setEditForm((f) => ({ ...f, award_amount: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Similar bids sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Similar {bid.category} Bids
          </h2>
          {similarBids.length === 0 ? (
            <p className="text-xs text-gray-400">No similar bids found</p>
          ) : (
            <div className="space-y-3">
              {similarBids.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/bids/${s.id}`}
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <p className="text-xs font-medium text-gray-900 truncate">{s.project_title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">${Number(s.bid_amount).toLocaleString()}</span>
                    <StatusBadge outcome={s.outcome} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
