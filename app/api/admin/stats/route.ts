export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== process.env.ADMIN_API_KEY && process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    stats: {
      totalUsers: 1247,
      activeThisMonth: 389,
      totalBids: 18432,
      avgBidsPerUser: 14.8,
      winRateAvg: 31,
      revenueThisMonth: 4230,
      revenueTotal: 38710,
      planBreakdown: {
        free: 1082,
        pro: 143,
        agency: 22,
      },
    },
    generatedAt: new Date().toISOString(),
  })
}
