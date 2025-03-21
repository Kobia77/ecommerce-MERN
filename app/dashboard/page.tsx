"use client";

export default function DashboardLoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-gray-600 text-lg">Loading your dashboard...</p>
    </div>
  );
}
