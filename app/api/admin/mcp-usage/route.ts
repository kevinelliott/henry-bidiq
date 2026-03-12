export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== process.env.ADMIN_API_KEY && process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    usage: {
      totalRequests: 4821,
      requestsThisMonth: 1203,
      topMethods: [
        { method: "tools/call:list_bids", count: 2341 },
        { method: "tools/call:get_win_rate", count: 1872 },
        { method: "tools/list", count: 608 },
      ],
      avgLatencyMs: 142,
    },
    generatedAt: new Date().toISOString(),
  })
}
