import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next"

import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet AI",
  description: "Meet AI is a platform that connects people with AI-powered virtual assistants."
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
    <TRPCReactProvider>
      <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Toaster/>
        {children}
      </body>
    </html>
    </TRPCReactProvider>
    </NuqsAdapter> 
    
  );
}
