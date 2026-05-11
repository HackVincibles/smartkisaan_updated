import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { polygonService } from "@/lib/polygon";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // 1. Verify Webhook Signature (Idempotency & Security)
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const { payload } = event;

    // 2. Handle Payment Captured
    if (event.event === "payment.captured") {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.notes.order_id;

      // Update Order Status in DB (State Machine Enforcement)
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: "PAID_ESCROW",
          payments: {
            update: {
              where: { razorpayOrderId: payload.payment.entity.order_id },
              data: { razorpayPaymentId: paymentId, status: "captured" }
            }
          }
        }
      });

      // 3. Optional: Log initial payment intent to Polygon for audit
      // await polygonService.logPaymentIntent(orderId, payload.payment.entity.amount);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
