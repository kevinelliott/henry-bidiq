export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

function getStripe() {
  const Stripe = require("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 })
  }

  const db = createServiceClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const userId = session.metadata?.user_id
        const plan = session.metadata?.plan
        const customerId = session.customer
        const subscriptionId = session.subscription

        if (userId) {
          await db.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: plan || "pro",
            status: "active",
          }, { onConflict: "user_id" })
        }
        break
      }

      case "customer.subscription.updated": {
        const sub = event.data.object
        const status = sub.status === "active" ? "active" :
                       sub.status === "canceled" ? "canceled" : "past_due"

        await db
          .from("subscriptions")
          .update({ status })
          .eq("stripe_subscription_id", sub.id)
        break
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object
        await db
          .from("subscriptions")
          .update({ status: "canceled", plan: "free" })
          .eq("stripe_subscription_id", sub.id)
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
