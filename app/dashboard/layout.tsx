"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/userStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useUser();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  // Ref to ensure we fetch the user only once
  const hasFetched = useRef(false);

  // Fetch user data from your API if not fetched yet
  useEffect(() => {
    if (!isLoaded || hasFetched.current) return;

    async function fetchUser() {
      try {
        const res = await fetch("/api/user/getUser");
        if (!res.ok) {
          router.push("/register");
          //   throw new Error(`Error fetching user: ${res.statusText}`);
        }
        const data = await res.json();
        if (process.env.NODE_ENV !== "production") {
          console.log("Fetched user document:", data);
        }
        setUser(data);
        hasFetched.current = true;
      } catch (error: any) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error in fetchUser:", error);
        }
      }
    }
    fetchUser();
  }, [isLoaded, setUser]);

  // Handle redirection based on user role once the user is loaded
  useEffect(() => {
    if (!isLoaded || !user) return;

    if (process.env.NODE_ENV !== "production") {
      console.log("DashboardLayout: User loaded:", user);
    }

    const role = user.role;

    if (process.env.NODE_ENV !== "production") {
      console.log("DashboardLayout: Detected user role:", role);
    }

    if (role === "seller") {
      router.push("/dashboard/seller");
    } else if (role === "customer") {
      router.push("/dashboard/customer");
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "DashboardLayout: Unrecognized user role. Staying on dashboard layout."
        );
      }
    }
  }, [isLoaded, user, router]);

  return <>{children}</>;
}
