export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

interface MCPRequest {
  jsonrpc: "2.0"
  id: string | number
  method: string
  params?: Record<string, unknown>
}

const TOOLS = [
  {
    name: "list_bids",
    description: "List bids for the authenticated user",
    inputSchema: {
      type: "object",
      properties: {
        outcome: { type: "string", enum: ["won", "lost", "submitted", "in-progress", "no-bid"] },
        limit: { type: "number", default: 20 },
      },
    },
  },
  {
    name: "get_win_rate",
    description: "Get the overall win rate and category breakdown",
    inputSchema: { type: "object", properties: {} },
  },
]

export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest = await request.json()
    const { jsonrpc, id, method, params } = body

    if (jsonrpc !== "2.0") {
      return NextResponse.json({ error: "Invalid JSON-RPC version" }, { status: 400 })
    }

    const db = createServiceClient()

    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "bidiq-mcp", version: "1.0.0" },
        },
      })
    }

    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { tools: TOOLS },
      })
    }

    if (method === "tools/call") {
      const toolName = (params as { name?: string })?.name
      const toolArgs = (params as { arguments?: Record<string, unknown> })?.arguments || {}

      if (toolName === "list_bids") {
        const { data } = await db
          .from("bid_logs")
          .select("*")
          .order("submitted_date", { ascending: false })
          .limit((toolArgs.limit as number) || 20)

        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          },
        })
      }

      if (toolName === "get_win_rate") {
        const { data } = await db
          .from("bid_logs")
          .select("outcome, category, bid_amount")

        const won = data?.filter((b) => b.outcome === "won").length || 0
        const decided = data?.filter((b) => b.outcome === "won" || b.outcome === "lost").length || 0
        const winRate = decided > 0 ? Math.round((won / decided) * 100) : 0

        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({ winRate, won, decided, total: data?.length }, null, 2),
              },
            ],
          },
        })
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Unknown tool: ${toolName}` },
      })
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Unknown method: ${method}` },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
