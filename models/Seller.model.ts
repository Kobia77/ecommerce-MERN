// Seller.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IAddress } from "@/utils/Address.interface";

export enum UserRole {
  SELLER = "seller",
}

export interface ISeller extends Document {
  clerkId: string;
  role: UserRole;
  email: string;
  name: string;
  profilePictureUrl?: string;
  address?: IAddress;
  storeName: string;
  storeDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: [UserRole.SELLER],
      default: UserRole.SELLER,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      collation: { locale: "en", strength: 2 },
    },
    name: { type: String, required: true },
    profilePictureUrl: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    storeName: { type: String, required: true },
    storeDescription: { type: String, required: true },
  },
  { timestamps: true }
);

const Seller: Model<ISeller> =
  mongoose.models.Seller || mongoose.model<ISeller>("Seller", SellerSchema);
export default Seller;
