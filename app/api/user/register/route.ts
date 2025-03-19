import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User, { UserRole } from "@/models/User";
import { clerkClient } from "@clerk/nextjs/server";

function logResponse(status: number, payload: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`📤 [${status}] Response:`, payload);
  }
}

export const POST = withAuth(async (request: Request, authenticatedClerkId: string) => {
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

    // Verify that the provided clerkId actually exists in Clerk
    try {
      const clerk = await clerkClient();
      await clerk.users.getUser(clerkId);
    } catch {
      const payload = { error: "Invalid clerkId" };
      logResponse(400, payload);
      return NextResponse.json(payload, { status: 400 });
    }

    // Ensure the request body’s clerkId matches the authenticated user’s Clerk ID
    if (clerkId !== authenticatedClerkId) {
      const payload = { error: "Forbidden — clerkId mismatch" };
      logResponse(403, payload);
      return NextResponse.json(payload, { status: 403 });
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
    const error =
      unknownError instanceof Error ? unknownError : new Error(String(unknownError));
    const payload = { error: error.message || "Internal server error" };

    if (process.env.NODE_ENV !== "production") {
      console.error("❌ POST /api/user/register error:", error);
    }

    logResponse(500, payload);
    return NextResponse.json(payload, { status: 500 });
  }
});
