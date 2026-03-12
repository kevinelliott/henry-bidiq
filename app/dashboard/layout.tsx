import DashboardNav from "@/components/DashboardNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar placeholder for desktop layout - DashboardNav handles this */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
