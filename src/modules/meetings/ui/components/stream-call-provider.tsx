"use client";

import { 
  StreamVideo, 
  StreamVideoClient, 
  User 
} from "@stream-io/video-react-sdk";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { authClient } from "@/lib/auth-client";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

interface StreamCallProviderProps {
  children: React.ReactNode;
}

export const StreamCallProvider = ({ children }: StreamCallProviderProps) => {
  const trpc = useTRPC();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  const { data: tokenData, error: tokenError, isLoading: isTokenLoading } = useQuery({
    ...trpc.meeting.generateToken.queryOptions(),
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 50, // Cache token for 50 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });

  useEffect(() => {
    const userId = session?.user?.id;
    const token = tokenData?.token;

    console.log("[StreamCallProvider] Effect triggered", {
      userId,
      hasToken: !!token,
      hasClient: !!videoClient
    });

    if (!userId || !token || videoClient) {
      return;
    }

    console.log("[StreamCallProvider] Initializing client for:", userId);

    const user: User = {
      id: userId,
      name: session.user.name ?? session.user.email,
      image: session.user.image ?? undefined,
    };

    let client: StreamVideoClient | undefined;

    try {
      if (!apiKey) {
        throw new Error("Stream API Key is missing");
      }

      client = new StreamVideoClient({
        apiKey,
        user,
        token,
      });

      setVideoClient(client);
      setInitError(null);
      console.log("[StreamCallProvider] Client set successfully");
    } catch (e) {
      console.error("[StreamCallProvider] Init error:", e);
      setInitError(e instanceof Error ? e.message : "Failed to initialize video client");
    }

    return () => {
      if (client) {
        console.log("[StreamCallProvider] Cleanup - disconnecting client");
        client.disconnectUser().catch((e) => {
          console.error("[StreamCallProvider] Disconnect error:", e);
        });
      }
    };
  }, [session?.user?.id, tokenData?.token, apiKey]);

  if (isAuthPending) {
    return (
      <LoadingState 
        title="Authenticating"
        description="Checking your session..." 
      />
    );
  }

  if (!session?.user) {
    return (
      <ErrorState 
        title="Authentication Required"
        description="Please sign in to access meeting features. (Session not found)" 
      />
    );
  }

  if (!apiKey) {
    return (
      <ErrorState 
        title="Configuration Error"
        description="Stream API Key is missing. Please set NEXT_PUBLIC_STREAM_API_KEY in .env" 
      />
    );
  }

  if (isTokenLoading) {
    return (
      <LoadingState 
        title="Connecting"
        description={`Fetching meeting token for user: ${session.user.id}...`} 
      />
    );
  }

  if (tokenError) {
    return (
      <ErrorState 
        title="Connection Error"
        description={tokenError.message || "Failed to generate meeting token. Check if STREAM_API_SECRET is set."} 
      />
    );
  }

  if (tokenData && !tokenData.token) {
    return (
      <ErrorState 
        title="Token Error"
        description="Received empty token from server. Please check your Stream configuration." 
      />
    );
  }

  if (initError) {
    return (
      <ErrorState 
        title="Initialization Error"
        description={initError} 
      />
    );
  }

  if (!videoClient) {
    return (
      <LoadingState 
        title="Initializing"
        description="Setting up video client..." 
      />
    );
  }

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};
