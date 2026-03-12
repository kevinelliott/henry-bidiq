import type { BidOutcome } from "@/lib/types"

interface StatusBadgeProps {
  outcome: BidOutcome | string
}

export default function StatusBadge({ outcome }: StatusBadgeProps) {
  const classes: Record<string, string> = {
    won: "badge-won",
    lost: "badge-lost",
    submitted: "badge-submitted",
    "in-progress": "badge-in-progress",
    "no-bid": "badge-no-bid",
    pending: "badge-pending",
  }

  const labels: Record<string, string> = {
    won: "Won",
    lost: "Lost",
    submitted: "Submitted",
    "in-progress": "In Progress",
    "no-bid": "No Bid",
    pending: "Pending",
  }

  const cls = classes[outcome] || "badge-pending"
  const label = labels[outcome] || outcome

  return <span className={cls}>{label}</span>
}
