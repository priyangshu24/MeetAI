"use client";

import { Call, StreamCall, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { CallView } from "../components/call-view";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MeetingSetup } from "../components/meeting-setup";
import { ErrorBoundary } from "react-error-boundary";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallPageProps {
  meetingId: string;
}

export const CallPage = ({ meetingId }: CallPageProps) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    if (!client) return;

    let activeCall: Call | undefined;

    const initCall = async () => {
      try {
        const newCall = client.call("default", meetingId);
        activeCall = newCall;
        
        // Ensure call exists but don't join yet
        await newCall.getOrCreate();
        
        setCall(newCall);
      } catch (e) {
        console.error("Critical call initialization error:", e);
        setError(e instanceof Error ? e.message : "Failed to initialize call");
      }
    };

    initCall();

    return () => {
      if (activeCall && activeCall.state.callingState !== "left") {
        activeCall.leave().catch((e) => {
          if (e.message !== "Cannot leave call that has already been left.") {
            console.error("Error leaving call:", e);
          }
        });
      }
    };
  }, [client, meetingId]);

  if (error) {
    return (
      <ErrorState 
        title="Failed to join call"
        description={error}
      />
    );
  }

  if (!call) {
    return (
      <LoadingState 
        title="Joining meeting"
        description="Initializing call..."
      />
    );
  }

  return (
    <StreamCall call={call}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
            <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <AlertCircle className="size-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-white/50 text-sm max-w-sm mb-8">
              {error.message || "An error occurred while setting up the meeting."}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 rounded-xl font-bold transition-all"
            >
              Refresh Page
            </Button>
          </div>
        )}
      >
        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <CallView call={call} />
        )}
      </ErrorBoundary>
    </StreamCall>
  );
};
