
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export function withAuth(handler: (request: Request, userId: string) => Promise<NextResponse>) {
  return async (request: Request) => {
    const { userId } = await auth();
    if (!userId) {
        if (process.env.NODE_ENV !== "production") {
            console.log(`📤 [401] Response: Unauthorized — please sign in`);
            }
        return NextResponse.json({ error: "Unauthorized — please sign in" }, { status: 401 });
    }
    return handler(request, userId);
  };
}
