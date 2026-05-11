import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { aiService } from "@/lib/ai";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.user.role !== "FARMER" && session.user.role !== "FPO")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { product, quantity, unit, pricePerUnit, images, description, farmerId } = body;

    // 1. AI Grading (Stage 1)
    const crop = await aiService.detectCrop(images[0]);
    const { grade, score } = await aiService.gradeQuality(images[0], crop);
    const shelfLife = await aiService.estimateShelfLife(crop, grade);

    // 2. Create Listing
    const listing = await prisma.listing.create({
      data: {
        farmerId: farmerId || session.user.id, // FPO can provide farmerId
        product,
        quantity,
        unit: unit || "kg",
        pricePerUnit,
        images,
        description,
        aiGrade: grade,
        aiScore: score,
        shelfLife,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    console.error("Listing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const grade = searchParams.get("grade");

  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
      ...(q && { product: { contains: q, mode: "insensitive" } }),
      ...(grade && { aiGrade: grade }),
    },
    include: { farmer: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(listings);
}
