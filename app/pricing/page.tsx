import Link from "next/link"
import Nav from "@/components/Nav"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started tracking your bids",
    color: "border-gray-200",
    headerBg: "bg-gray-50",
    cta: "Get started free",
    ctaHref: "/auth/signup",
    ctaStyle: "border border-gray-300 text-gray-900 hover:bg-gray-50",
    features: [
      "Up to 10 bids",
      "Basic win rate tracking",
      "Overall win rate %",
      "Bid status tracking",
      "Email support",
    ],
    notIncluded: [
      "Category breakdown",
      "Price sweet spot analysis",
      "Seasonal patterns",
      "Data export",
      "Multiple users",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For contractors serious about winning more bids",
    color: "border-indigo-500",
    headerBg: "bg-indigo-600",
    popular: true,
    cta: "Start Pro — $19/mo",
    ctaHref: "/auth/signup?plan=pro",
    ctaStyle: "bg-indigo-600 text-white hover:bg-indigo-700",
    features: [
      "Unlimited bids",
      "Full win rate analytics",
      "Category breakdown",
      "Price sweet spot analysis",
      "Seasonal patterns",
      "Competitor count tracking",
      "Data export (CSV)",
      "Priority email support",
    ],
    notIncluded: [
      "Multiple users",
      "Client segmentation",
      "White-label reports",
    ],
  },
  {
    name: "Agency",
    price: "$49",
    period: "per month",
    description: "For estimating teams and multi-user organizations",
    color: "border-gray-200",
    headerBg: "bg-gray-50",
    cta: "Start Agency — $49/mo",
    ctaHref: "/auth/signup?plan=agency",
    ctaStyle: "border border-gray-300 text-gray-900 hover:bg-gray-50",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Client segmentation",
      "Advanced reporting",
      "White-label exports",
      "Custom categories",
      "Dedicated account manager",
      "Phone support",
    ],
    notIncluded: [],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600">
            Start free. Upgrade when BidIQ pays for itself — which usually takes one extra win.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border-2 ${plan.color} overflow-hidden ${plan.popular ? "shadow-xl scale-105" : "shadow-sm"} relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center -mt-4">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className={`${plan.headerBg} p-6 ${plan.popular ? "pt-8" : ""}`}>
                  <h2 className={`text-xl font-bold mb-1 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h2>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-extrabold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-indigo-200" : "text-gray-500"}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.popular ? "text-indigo-100" : "text-gray-600"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <Link
                    href={plan.ctaHref}
                    className={`block text-center py-3 px-4 rounded-xl font-semibold transition-colors ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </Link>

                  <div className="space-y-3">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <div key={f} className="flex items-start gap-2 opacity-40">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm text-gray-500">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes! You can upgrade or downgrade at any time. If you upgrade, you'll be billed the difference immediately. If you downgrade, you'll keep your current plan until the end of the billing period.",
              },
              {
                q: "What happens to my data if I downgrade to Free?",
                a: "Your data is always yours. If you downgrade, you keep access to your 10 most recent bids. All your historical data is preserved and will be available if you upgrade again.",
              },
              {
                q: "Is there a contract or commitment?",
                a: "No contracts, no commitments. Pro and Agency plans are month-to-month. Cancel anytime from your settings page.",
              },
              {
                q: "Do you offer a trial period?",
                a: "The Free plan is your trial — use BidIQ with up to 10 bids to see if it's right for your business. No time limit, no credit card required.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="flex items-center gap-2 justify-center mb-4">
            <span className="text-xl">📊</span>
            <span className="text-white font-bold">BidIQ</span>
          </Link>
          <p className="text-sm">© 2025 BidIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
