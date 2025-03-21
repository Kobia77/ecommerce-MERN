import { create } from "zustand";
import { ICustomer } from "@/models/Customer.model";
import { ISeller } from "@/models/Seller.model";

interface UserState {
  user: ICustomer | ISeller | null;
  setUser: (user: ICustomer | ISeller) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
