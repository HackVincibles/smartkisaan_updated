import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { aiService } from "@/lib/ai";
import { ipfsService } from "@/lib/ipfs";
import { polygonService } from "@/lib/polygon";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "TRANSPORT") {
      return NextResponse.json({ error: "Only transporters can verify" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, imageUrl, stage } = body; // stage: pickup or delivery

    // 1. Get Order & Listing
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { buyer: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const listing = await prisma.listing.findUnique({ where: { id: order.listingId } });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    // 2. AI Stage 2/3 (Similarity Check)
    const crop = await aiService.detectCrop(imageUrl);
    const { grade, score } = await aiService.gradeQuality(imageUrl, crop);
    
    // Compare with listing score
    const similarity = score / (listing.aiScore || 1);

    // 3. IPFS Upload (Evidence)
    const cid = await ipfsService.uploadFromUrl(imageUrl, `order_${orderId}_${stage}.jpg`);

    // 4. Polygon Smart Contract Update (Trust Engine)
    let txHash = "";
    if (stage === "delivery") {
      const res = await polygonService.confirmDeliveryOnChain(orderId, score, cid);
      txHash = res.hash;
    }

    // 5. Update DB & Handle Disputes
    let status = order.status;
    if (stage === "delivery") {
      if (similarity >= 0.8) {
        status = "COMPLETED";
      } else if (similarity >= 0.6) {
        status = "DISPUTED"; // Panchayat logic
      } else {
        status = "DISPUTED";
      }
    } else {
      status = "PICKED_UP";
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });

    await prisma.aIScan.create({
      data: {
        orderId,
        stage,
        imageCID: cid,
        score: similarity,
        blockchainTx: txHash,
      },
    });

    return NextResponse.json({
      success: true,
      similarity,
      status,
      blockchainTx: txHash,
      ipfsCID: cid,
    });
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
