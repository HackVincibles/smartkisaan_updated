import { aiService } from "@/lib/ai";
import { polygonService } from "@/lib/polygon";
import { ipfsService } from "@/lib/ipfs";
import { prisma } from "@/lib/db";

/**
 * Handles long-running Trust Engine tasks in the background.
 * Prevents HTTP Timeouts (the #1 backend killer).
 */
export async function runTrustVerification(orderId: string, imageUrl: string, stage: string) {
  // 1. Immediate return? No, this function is called without 'await' in the route.
  
  try {
    console.log(`Starting Async Trust Verification for Order ${orderId}...`);

    // A. AI Processing (Slow API)
    const crop = await aiService.detectCrop(imageUrl);
    const { score } = await aiService.gradeQuality(imageUrl, crop);

    // B. IPFS Evidence (Slow API)
    const cid = await ipfsService.uploadFromUrl(imageUrl, `order_${orderId}_${stage}.jpg`);

    // C. Polygon Smart Contract (Slow Transaction)
    const { hash } = await polygonService.confirmDeliveryOnChain(orderId, score, cid);

    // D. Update Database with Proof
    await prisma.aIScan.create({
      data: {
        orderId,
        stage,
        imageCID: cid,
        score,
        blockchainTx: hash,
      },
    });

    console.log(`Trust Verification Complete for Order ${orderId}. Hash: ${hash}`);
  } catch (error) {
    console.error(`Background Task Failed for Order ${orderId}:`, error);
    // In production, push to a DLQ (Dead Letter Queue) or notify admin
  }
}
