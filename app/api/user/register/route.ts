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

    const { role, name: overrideName, storeName, storeDescription, shippingAddress } =
      await request.json();

    if (!role) {
      const payload = { error: "Missing required field: role" };
      logResponse(400, payload);
      return NextResponse.json(payload, { status: 400 });
    }

    // Fetch the authenticated Clerk user
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(authenticatedClerkId);
    const emailObj = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId);
    const email = emailObj?.emailAddress;
    if (!email) {
      const payload = { error: "Could not retrieve primary email from Clerk" };
      logResponse(500, payload);
      return NextResponse.json(payload, { status: 500 });
    }

    // Prevent duplicate registrations
    if (await User.findOne({ clerkId: authenticatedClerkId })) {
      const payload = { message: "User already exists" };
      logResponse(400, payload);
      return NextResponse.json(payload, { status: 400 });
    }

    const newUser = new User({
      clerkId: authenticatedClerkId,
      role,
      email,
      name: overrideName ?? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
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
