"use client";

import { 
  DeviceSettings, 
  VideoPreview, 
  useCall 
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mic, MicOff, Video, VideoOff, Settings, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
}

export const MeetingSetup = ({ setIsSetupComplete }: MeetingSetupProps) => {
  const [isMicToggledOn, setIsMicToggledOn] = useState(false);
  const [isCamToggledOn, setIsCamToggledOn] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const call = useCall();
  const router = useRouter();

  if (!call) {
    throw new Error("useCall must be used within StreamCall component");
  }

  // Force microphone on and camera off on mount
  useEffect(() => {
    const initDevices = async () => {
      try {
        await call.camera.disable();
        setIsCamToggledOn(false);
        
        await call.microphone.enable();
        setIsMicToggledOn(true);
      } catch (e) {
        console.error("Error initializing devices:", e);
      } finally {
        setIsInitialLoading(false);
      }
    };
    initDevices();
  }, [call]);

  const handleMicToggle = async () => {
    try {
      if (isMicToggledOn) {
        await call.microphone.disable();
        setIsMicToggledOn(false);
      } else {
        await call.microphone.enable();
        setIsMicToggledOn(true);
      }
    } catch (e: any) {
      handleDeviceError(e, "Microphone");
    }
  };

  const handleCamToggle = async () => {
    try {
      if (isCamToggledOn) {
        await call.camera.disable();
        setIsCamToggledOn(false);
      } else {
        await call.camera.enable();
        setIsCamToggledOn(true);
      }
    } catch (e: any) {
      handleDeviceError(e, "Camera");
    }
  };

  const handleDeviceError = (e: any, deviceType: string) => {
    console.error(`${deviceType} access error:`, e);
    // Don't block the UI, just disable the toggle
    if (deviceType === "Camera") setIsCamToggledOn(false);
    if (deviceType === "Microphone") setIsMicToggledOn(false);
  };

  if (isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0B0B0B]">
        <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white bg-[#0B0B0B] p-4">
      <div className="max-w-[600px] w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col items-center gap-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Ready to join?</h1>
          <p className="text-muted-foreground text-sm">Set up your call before joining</p>
        </div>

        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 group">
          {isCamToggledOn ? (
            <VideoPreview />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
              <VideoOff className="size-12 text-white/20" />
              <p className="text-sm text-white/30 font-medium">Camera is off</p>
            </div>
          )}
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
            <Button
              variant={isMicToggledOn ? "secondary" : "destructive"}
              size="icon"
              onClick={handleMicToggle}
              className="size-11 rounded-full transition-all duration-300 shadow-xl"
            >
              {isMicToggledOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </Button>
            <Button
              variant={isCamToggledOn ? "secondary" : "destructive"}
              size="icon"
              onClick={handleCamToggle}
              className="size-11 rounded-full transition-all duration-300 shadow-xl"
            >
              {isCamToggledOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </Button>
            
            <DeviceSettings />
          </div>
        </div>

        <div className="w-full flex items-center justify-between pt-2">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-white hover:bg-white/5 px-6 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 rounded-xl font-semibold gap-x-2 h-11 transition-all duration-300 shadow-lg shadow-emerald-500/20"
            onClick={async () => {
              try {
                // Force camera off and mic on right before joining
                await call.camera.disable();
                await call.microphone.enable();
                
                await call.join({
                  create: true,
                });
                setIsSetupComplete(true);
              } catch (e: any) {
                console.error("Failed to join call:", e);
                // Fallback join if device enable still fails
                try {
                  await call.join({ create: true });
                  setIsSetupComplete(true);
                } catch (lastResort) {
                  console.error("Join failed completely", lastResort);
                }
              }
            }}
          >
            Join Call
          </Button>
        </div>
      </div>
    </div>
  );
};
