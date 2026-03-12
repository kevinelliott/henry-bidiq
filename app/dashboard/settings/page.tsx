"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [plan, setPlan] = useState("free")

  useEffect(() => {
    async function load() {
      const supabase = getSupabase()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (u) {
        setUser(u)
        setName(u.user_metadata?.name || "")
        setCompany(u.user_metadata?.company || "")

        // Load subscription
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", u.id)
          .single()

        if (sub) setPlan(sub.plan)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.updateUser({
        data: { name, company },
      })

      if (error) {
        setMessage({ type: "error", text: error.message })
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" })
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update profile." })
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    router.push("/")
  }

  async function handleUpgrade(plan: string) {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setMessage({ type: "error", text: "Failed to start checkout. Please try again." })
    }
  }

  async function handleManageBilling() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setMessage({ type: "error", text: "Failed to open billing portal." })
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-400">Loading settings...</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${
          message.type === "success"
            ? "bg-green-50 border border-green-100 text-green-700"
            : "bg-red-50 border border-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Morrison"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Morrison Construction Group"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Plan & Billing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Plan & Billing</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
          <div>
            <p className="font-semibold text-gray-900 capitalize">{plan} Plan</p>
            <p className="text-sm text-gray-500">
              {plan === "free" ? "10 bids included" : plan === "pro" ? "$19/month · Unlimited bids" : "$49/month · 5 users"}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            plan !== "free" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}>
            {plan !== "free" ? "Active" : "Free"}
          </span>
        </div>

        {plan === "free" ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">Upgrade to unlock unlimited bids and advanced analytics.</p>
            <button
              onClick={() => handleUpgrade("pro")}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Upgrade to Pro — $19/mo
            </button>
            <button
              onClick={() => handleUpgrade("agency")}
              className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Upgrade to Agency — $49/mo
            </button>
          </div>
        ) : (
          <button
            onClick={handleManageBilling}
            className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Manage Billing
          </button>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-red-700 mb-2">Sign Out</h2>
        <p className="text-sm text-gray-500 mb-4">
          You&apos;ll need to sign in again to access your dashboard.
        </p>
        <button
          onClick={handleSignOut}
          className="border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
