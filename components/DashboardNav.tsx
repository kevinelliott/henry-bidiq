"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/bids", label: "Bid Log", icon: "📋" },
  { href: "/dashboard/bids/new", label: "Log Bid", icon: "➕" },
  { href: "/dashboard/insights", label: "Insights", icon: "💡" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-md text-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span className="text-lg font-bold text-gray-900">BidIQ</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bids/new"
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Log Bid
          </Link>
        </div>
      </header>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform transition-transform duration-200
          lg:static lg:translate-x-0 lg:block
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-5 border-b border-gray-700">
          <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <span className="text-xl">📊</span>
            <span className="text-lg font-bold text-white">BidIQ</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <span>↩️</span> Sign out
          </Link>
        </div>
      </aside>
    </>
  )
}
