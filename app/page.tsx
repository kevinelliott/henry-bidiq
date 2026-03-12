import Link from "next/link"
import Nav from "@/components/Nav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-700 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Trusted by 1,200+ contractors
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Know your numbers.<br />
            <span className="text-indigo-600">Win more bids.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            BidIQ gives contractors the analytics they need to understand their win rate,
            price strategically, and land more projects. Stop guessing — start winning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Start free today
            </Link>
            <Link
              href="/demo"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              See live demo →
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">Free forever for 10 bids. No credit card required.</p>
        </div>

        {/* Decorative */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full opacity-40 blur-3xl" />
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold text-indigo-600 mb-2">31%</div>
              <div className="text-base font-medium text-gray-900 mb-1">Average win rate</div>
              <div className="text-sm text-gray-500">across all contractors</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-indigo-600 mb-2">68%</div>
              <div className="text-base font-medium text-gray-900 mb-1">Win more when tracking</div>
              <div className="text-sm text-gray-500">vs. not tracking bids</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-indigo-600 mb-2">$127K</div>
              <div className="text-base font-medium text-gray-900 mb-1">Avg bid value tracked</div>
              <div className="text-sm text-gray-500">across all bid categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to win more bids
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              BidIQ turns your bid history into actionable intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📈",
                title: "Win Rate Analytics",
                desc: "Track your win rate over time, by category, by client type, and by price range. Understand exactly where you win and where you lose.",
              },
              {
                icon: "💰",
                title: "Price Intelligence",
                desc: "Discover your sweet spot price range — where you win most. Know how far below market your winning bids typically land.",
              },
              {
                icon: "🎯",
                title: "Category Breakdown",
                desc: "See win rates across bid categories. Focus your energy where you have the highest probability of winning.",
              },
              {
                icon: "📅",
                title: "Seasonal Patterns",
                desc: "Identify your best months. Know when to be aggressive and when to hold back based on historical patterns.",
              },
              {
                icon: "🏆",
                title: "Competitor Analysis",
                desc: "Track competitor count per bid. See whether fewer competitors correlates with higher win rates for your business.",
              },
              {
                icon: "📤",
                title: "Export & Reports",
                desc: "Export your bid data to CSV. Generate reports for your team or share with partners. Your data, your way.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How BidIQ works</h2>
            <p className="text-xl text-gray-600">Three steps to better bid strategy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Log your bids",
                desc: "Enter each bid as you submit it — client, project, amount, category. Takes 30 seconds per bid.",
              },
              {
                step: "2",
                title: "Update outcomes",
                desc: "When decisions come in, mark bids won or lost. BidIQ builds your win rate automatically.",
              },
              {
                step: "3",
                title: "Act on insights",
                desc: "See your win rate by price range, category, and timing. Bid smarter based on real data.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to win more bids?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join 1,200+ contractors tracking their win rates with BidIQ.
            Start free, upgrade when you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Start free today
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <span className="text-white font-bold">BidIQ</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
            </div>
            <p className="text-sm">© 2025 BidIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
