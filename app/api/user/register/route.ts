import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import User, { UserRole } from "@/models/User";

function logResponse(status: number, payload: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`📤 [${status}] Response:`, payload);
    console.log("NODE_ENV =", process.env.NODE_ENV);
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    const payload = { error: "Unauthorized — please sign in" };
    logResponse(401, payload);
    return NextResponse.json(payload, { status: 401 });
  }

  try {
    await connectDB();

    const {
      clerkId,
      role,
      email,
      name,
      storeName,
      storeDescription,
      shippingAddress,
    } = await request.json();

    if (!clerkId || !role || !email) {
      const payload = { error: "Missing required fields: clerkId, role, email" };
      logResponse(400, payload);
      return NextResponse.json(payload, { status: 400 });
    }

    if (await User.findOne({ clerkId })) {
      const payload = { message: "User already exists" };
      logResponse(400, payload);
      return NextResponse.json(payload, { status: 400 });
    }

    const newUser = new User({
      clerkId,
      role,
      email,
      name,
      storeName: role === UserRole.SELLER ? storeName : undefined,
      storeDescription: role === UserRole.SELLER ? storeDescription : undefined,
      shippingAddress: role === UserRole.CUSTOMER ? shippingAddress : undefined,
    });

    await newUser.save();

    const payload = { message: "User registered successfully", user: newUser };
    logResponse(201, payload);
    return NextResponse.json(payload, { status: 201 });
  } catch (unknownError) {
    const error = unknownError instanceof Error ? unknownError : new Error(String(unknownError));
    const payload = { error: error.message || "Internal server error" };

    if (process.env.NODE_ENV !== "production") {
      console.error("❌ POST /api/user/register error:", error);
    }

    logResponse(500, payload);
    return NextResponse.json(payload, { status: 500 });
  }
}
