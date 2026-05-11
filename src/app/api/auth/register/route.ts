import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { encrypt, login } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, fullName, role, aadhaar, profile } = body;

    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Hash Aadhaar
    const aadhaarHash = crypto.createHash("sha256").update(aadhaar).digest("hex");

    // 3. Create User
    const user = await prisma.user.create({
      data: {
        phone,
        fullName,
        role,
        aadhaarHash,
        isVerified: true,
      },
    });

    // 4. Create Profile
    if (role === "FARMER") {
      await prisma.farmer.create({
        data: {
          userId: user.id,
          farmLocation: profile.farmLocation,
          farmSize: profile.farmSize,
          cropsGrown: profile.cropsGrown,
          bankAccount: profile.bankAccount,
        },
      });
    } else if (role === "BUYER") {
      await prisma.buyer.create({
        data: {
          userId: user.id,
          businessType: profile.businessType,
          gst: profile.gst,
          deliveryAddress: profile.deliveryAddress,
        },
      });
    }

    await login(user);
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
