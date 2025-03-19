import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Seller, { UserRole } from "@/models/Seller.model";
import { clerkClient } from "@clerk/nextjs/server";

function logResponse(status: number, payload: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`📤 [${status}] Response:`, payload);
  }
}

export const POST = withAuth(
  async (request: Request, authenticatedClerkId: string) => {
    try {
      await connectDB();

      const {
        storeName,
        storeDescription,
        name: overrideName,
        profilePictureUrl,
        address,
      } = await request.json();

      // Fetch the authenticated Clerk user
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(authenticatedClerkId);
      const emailObj = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      );
      const email = emailObj?.emailAddress;
      if (!email) {
        const payload = {
          error: "Could not retrieve primary email from Clerk",
        };
        logResponse(500, payload);
        return NextResponse.json(payload, { status: 500 });
      }

      // Prevent duplicate registrations
      if (await Seller.findOne({ clerkId: authenticatedClerkId })) {
        const payload = { message: "Seller already exists" };
        logResponse(400, payload);
        return NextResponse.json(payload, { status: 400 });
      }

      const newSeller = new Seller({
        clerkId: authenticatedClerkId,
        role: UserRole.SELLER,
        email,
        name:
          overrideName ??
          `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        storeName,
        storeDescription,
        profilePictureUrl,
        address,
      });

      await newSeller.save();

      const payload = {
        message: "Seller registered successfully",
        user: newSeller,
      };
      logResponse(201, payload);
      return NextResponse.json(
        { message: "Seller registered successfully" },
        { status: 201 }
      );
    } catch (unknownError) {
      const error =
        unknownError instanceof Error
          ? unknownError
          : new Error(String(unknownError));
      const payload = { error: error.message || "Internal server error" };

      if (process.env.NODE_ENV !== "production") {
        console.error("❌ POST /api/user/register/seller error:", error);
      }

      logResponse(500, payload);
      return NextResponse.json(payload, { status: 500 });
    }
  }
);
