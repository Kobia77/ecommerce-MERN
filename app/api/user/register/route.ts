// app/api/user/register/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User, { UserRole } from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { clerkId, role, email, name, storeName, storeDescription, shippingAddress } = body;

    // Check if the user already exists

    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Create a new user record based on role
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
    return NextResponse.json({ message: "User registered successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
