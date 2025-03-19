// Customer.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IAddress } from "@/utils/Address.interface";

export enum UserRole {
  CUSTOMER = "customer",
}

export interface ICustomer extends Document {
  clerkId: string;
  role: UserRole;
  email: string;
  name: string;
  profilePictureUrl?: string;
  address?: IAddress;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: [UserRole.CUSTOMER],
      default: UserRole.CUSTOMER,
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
    shippingAddress: { type: String },
  },
  { timestamps: true }
);

const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;
