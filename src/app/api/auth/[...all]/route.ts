import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);

// This ensures that Next.js doesn't cache the auth requests
export const dynamic = "force-dynamic";