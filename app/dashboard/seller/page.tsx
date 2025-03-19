"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function SellerDashboard() {
  const { user, isLoaded } = useUser();
  const [storeName, setStoreName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Simulating data fetch - in a real app, you'd fetch the store data
      setTimeout(() => {
        setStoreName(user.firstName || "");
        setIsLoading(false);
      }, 500);
    }
  }, [isLoaded, user]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
            <span className="font-medium text-lg">ShopNow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
              {user?.firstName?.[0] || "S"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-semibold mb-2">
            Welcome, {storeName || "Seller"}!
          </h1>
          <p className="text-neutral-600">
            This is your seller dashboard. Here you can manage your products,
            orders, and store settings.
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-neutral-500 text-sm font-medium mb-2">
              Products
            </h3>
            <p className="text-2xl font-semibold">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-neutral-500 text-sm font-medium mb-2">
              Orders
            </h3>
            <p className="text-2xl font-semibold">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-neutral-500 text-sm font-medium mb-2">
              Revenue
            </h3>
            <p className="text-2xl font-semibold">$0.00</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>
                <h3 className="font-medium">Add your first product</h3>
              </div>
              <p className="text-sm text-neutral-500">
                Start selling by adding products to your store inventory.
              </p>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Customize your store</h3>
              </div>
              <p className="text-sm text-neutral-500">
                Update your store details and customize your storefront.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
