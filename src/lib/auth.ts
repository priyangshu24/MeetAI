import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    baseURL: (process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, ""),
    trustedOrigins: [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "https://id.ngrok-free.dev", 
        "http://id.ngrok-free.dev",
        "https://lisandra-colorimetric-re-id.ngrok-free.dev",
        "http://lisandra-colorimetric-re-id.ngrok-free.dev",
        "https://lisandra-colorimetric-reid.ngrok-free.dev",
        "http://lisandra-colorimetric-reid.ngrok-free.dev",
        process.env.NEXT_PUBLIC_APP_URL || "",
        process.env.BETTER_AUTH_URL || "",
    ].filter(Boolean),
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
        },
        // Trust the headers sent by ngrok
        trustProxy: true,
        cookieOptions: {
            // This is required for cross-site cookies in some environments
            // especially when using tunnels like ngrok
            sameSite: "none",
            secure: true,
        }
    },
    // Add this to handle proxies correctly
    onNoSession: async () => {
        return {
            status: 401
        };
    },
    socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
        },
    }), 
});
