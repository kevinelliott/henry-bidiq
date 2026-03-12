export type BidOutcome = "won" | "lost" | "submitted" | "in-progress" | "no-bid" | "pending"

export interface BidLog {
  id: string
  user_id: string
  client_name: string
  project_title: string
  category: string
  bid_amount: number
  competitor_count: number | null
  submitted_date: string
  decision_date: string | null
  outcome: BidOutcome
  notes: string | null
  award_amount: number | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: "free" | "pro" | "agency"
  status: "active" | "canceled" | "past_due"
  created_at: string
}

export interface DashboardMetrics {
  totalBids: number
  winRate: number
  avgBidValue: number
  revenueWonYTD: number
  trend: number[]
}
