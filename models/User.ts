
import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
}

export interface IUser extends Document {
  clerkId: string;         // Clerk's unique user identifier
  role: UserRole;          // The role assigned to the user
  email: string;           // Email address (from Clerk)
  name?: string;           // Optional name field
  // Seller-specific fields
  storeName?: string;      
  storeDescription?: string;
  // Customer-specific fields (extend as needed)
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER],
      required: true,
    },
    email: { type: String, required: true },
    name: { type: String },
    // For sellers, you might store extra data
    storeName: { type: String },
    storeDescription: { type: String },
    // For customers, you might store shipping info or preferences
    shippingAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to enforce only one admin can exist
UserSchema.pre("save", async function (next) {
  const user = this as unknown as IUser;
  if (user.role === UserRole.ADMIN && user.isNew) {
    const adminCount = await mongoose.model("User").countDocuments({ role: UserRole.ADMIN });
    if (adminCount >= 1) {
      const error = new Error("Only one admin is allowed.");
      return next(error);
    }
  }
  next();
});

// Check if the model exists before creating a new one
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User as any;