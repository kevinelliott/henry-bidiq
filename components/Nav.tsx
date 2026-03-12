"use client"

import Link from "next/link"
import { useState } from "react"

interface NavProps {
  user?: { email?: string } | null
}

export default function Nav({ user }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="text-xl font-bold text-gray-900">BidIQ</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/demo" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Demo
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-2">
          <Link href="/demo" className="block py-2 text-gray-600 text-sm font-medium">Demo</Link>
          <Link href="/pricing" className="block py-2 text-gray-600 text-sm font-medium">Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="block py-2 text-gray-600 text-sm font-medium">Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login" className="block py-2 text-gray-600 text-sm font-medium">Log in</Link>
              <Link href="/auth/signup" className="block py-2 text-indigo-600 text-sm font-medium">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
