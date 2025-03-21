import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer.model";
import Seller from "@/models/Seller.model";

export const GET = withAuth(
  async (request: Request, authenticatedClerkId: string) => {
    try {
      await connectDB();

      // Try to find a customer with this clerkId
      let user = await Customer.findOne({ clerkId: authenticatedClerkId });
      if (!user) {
        // If not found in customers, try to find a seller
        user = await Seller.findOne({ clerkId: authenticatedClerkId });
      }

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Log the retrieved user in non-production environments
      if (process.env.NODE_ENV !== "production") {
        console.log("GET /api/user/getUser: Retrieved user document:", user);
      }

      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      if (process.env.NODE_ENV !== "production") {
        console.error("GET /api/user/me error:", error);
      }
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
