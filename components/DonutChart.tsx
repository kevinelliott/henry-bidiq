"use client"

interface DonutChartProps {
  won: number
  lost: number
  submitted: number
  inProgress: number
  noBid: number
  size?: number
}

export default function DonutChart({
  won,
  lost,
  submitted,
  inProgress,
  noBid,
  size = 200,
}: DonutChartProps) {
  const total = won + lost + submitted + inProgress + noBid
  if (total === 0) return null

  const radius = 80
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = 28
  const circumference = 2 * Math.PI * radius

  const segments = [
    { value: won, color: "#22c55e", label: "Won" },
    { value: lost, color: "#ef4444", label: "Lost" },
    { value: submitted, color: "#3b82f6", label: "Submitted" },
    { value: inProgress, color: "#eab308", label: "In Progress" },
    { value: noBid, color: "#9ca3af", label: "No Bid" },
  ]

  let cumulativePercent = 0
  const svgSegments = segments
    .filter((s) => s.value > 0)
    .map((seg) => {
      const percent = seg.value / total
      const dashArray = circumference * percent
      const dashOffset = circumference * (1 - cumulativePercent)
      cumulativePercent += percent
      return { ...seg, dashArray, dashOffset }
    })

  const winRate = total > 0 ? Math.round((won / total) * 100) : 0

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {svgSegments.map((seg, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dashArray} ${circumference - seg.dashArray}`}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          ))}
          {/* Center text */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            className="font-bold"
            fill="#111827"
            fontSize="28"
            fontWeight="700"
          >
            {winRate}%
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="12"
          >
            Win Rate
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3">
        {segments
          .filter((s) => s.value > 0)
          .map((seg) => (
            <div key={seg.label} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-gray-600">
                {seg.label} ({seg.value})
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
