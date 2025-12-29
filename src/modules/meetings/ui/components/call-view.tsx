"use client";

import { 
  Call, 
  CallingState, 
  SpeakerLayout, 
  useCallStateHooks,
  ParticipantsAudio,
  DeviceSettings,
  SfuModels,
  ParticipantView,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  hasAudio,
  hasVideo,
} from "@stream-io/video-react-sdk";
import { LoadingState } from "@/components/loading-state";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  LogOutIcon,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Users,
  CircleDot,
  ChevronUp,
  Smile,
  Layout,
  Signal,
  Info,
  MoreVertical,
  Lock,
  RefreshCw,
  XCircle,
  MessageSquare,
  UserPlus,
  Crown,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Settings,
  Share,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  text: string;
  user: string;
  userId: string;
  isAgent: boolean;
  timestamp: number;
}

interface CallViewProps {
  call: Call;
}

export const CallView = ({ call }: CallViewProps) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { 
    useCallCallingState, 
    useCallCustomData,
    useParticipants,
    useMicrophoneState,
    useCameraState,
    useIsCallRecordingInProgress,
    useLocalParticipant,
    useScreenShareState,
  } = useCallStateHooks();
  
  const callingState = useCallCallingState();
  const customData = useCallCustomData();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const { isMute: isMicMuted } = useMicrophoneState();
  const { isMute: isCamMuted } = useCameraState();
  const { status: screenShareStatus } = useScreenShareState();
  const isScreenSharing = screenShareStatus === 'enabled';
  const isRecording = useIsCallRecordingInProgress();
  const connectionQuality = localParticipant?.connectionQuality;

  const [showMuteToast, setShowMuteToast] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);

  // Participant Logic
  const agentParticipant = participants.find(p => p.userId.startsWith('agent-'));
  const pinnedParticipant = participants.find(p => p.sessionId === pinnedParticipantId);
  const mainParticipant = pinnedParticipant || agentParticipant || localParticipant;
  
  // Grid participants (those not in main view)
  const gridParticipants = participants.filter(p => p.sessionId !== mainParticipant?.sessionId);

  // Initial mock messages
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          id: '1', 
          text: "Hello! I'm your AI assistant. How can I help you today?", 
          user: agentParticipant?.name || "AI Agent", 
          userId: agentParticipant?.userId || 'agent',
          isAgent: true,
          timestamp: Date.now() - 10000
        },
      ]);
    }
  }, [agentParticipant]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  // Listen for chat messages via custom events
  useEffect(() => {
    const unsubscribe = call.on('custom', (event: any) => {
      if (event.type === 'chat-message') {
        const payload = event.custom as { text: string; user: string; isAgent: boolean; userId: string };
        
        // Skip if message is from local user to avoid duplicates (already added in sendMessage)
        if (payload.userId === localParticipant?.userId) return;
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            text: payload.text,
            user: payload.user,
            userId: payload.userId,
            isAgent: payload.isAgent,
            timestamp: Date.now(),
          },
        ]);
      }
    });

    return () => unsubscribe();
  }, [call]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLeaveCall = async () => {
    try {
      await call.leave();
      router.push("/");
      toast.success("You have left the meeting");
    } catch (error) {
      console.error("Error leaving call:", error);
      toast.error("Failed to leave the meeting properly");
    }
  };

  const handleMinimize = () => {
    toast.info("Meeting minimized to background", {
      description: "Feature coming soon: PIP mode",
      position: "top-center"
    });
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim() || !localParticipant) return;

    const payload = {
      text: messageInput.trim(),
      user: localParticipant.name || "User",
      userId: localParticipant.userId,
      isAgent: false,
    };

    try {
      await call.sendCustomEvent({
        type: 'chat-message',
        custom: payload,
      });

      // Add locally for immediate feedback
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...payload,
          timestamp: Date.now(),
        },
      ]);
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (isMicMuted) {
      setShowMuteToast(true);
      const timer = setTimeout(() => setShowMuteToast(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowMuteToast(false);
    }
  }, [isMicMuted]);

  // Handle speaker mute logic
  useEffect(() => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.muted = isSpeakerMuted;
    });
  }, [isSpeakerMuted, participants]); // Re-run when participants change as well to catch new audio elements

  const handleLeave = async () => {
    await call.leave();
    setIsCallEnded(true);
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await call.stopRecording();
        toast.success("Recording stopped");
      } else {
        await call.startRecording();
        toast.success("Recording started");
      }
    } catch (error) {
      console.error("Failed to toggle recording:", error);
      toast.error("Recording is not available for this meeting. Please check your plan or permissions.");
    }
  };

  const toggleScreenShare = async () => {
    try {
      await call.screenShare.toggle();
      if (!isScreenSharing) {
        toast.success("Screen sharing started");
      } else {
        toast.success("Screen sharing stopped");
      }
    } catch (error) {
      console.error("Failed to toggle screen share:", error);
      toast.error("Failed to toggle screen share");
    }
  };

  if (isCallEnded) {
    return (
      <div className="h-screen w-full bg-[#1F1D2B] flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="bg-[#2D2B3D] p-8 rounded-[32px] border border-white/5 shadow-2xl text-center space-y-6">
            <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
              <LogOutIcon className="size-8 text-red-500 rotate-180" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Meeting Ended</h2>
              <p className="text-white/40 text-sm">Thank you for using MeetAI.</p>
            </div>
            <Button 
              onClick={() => router.push('/meetings')}
              className="w-full h-12 bg-[#FF4B4B] hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <LoadingState 
        title="Connecting..."
        description="Please wait while we set up your secure meeting." 
      />
    );
  }

  return (
    <div className="h-screen w-full bg-[#1F1D2B] flex flex-col overflow-hidden text-white font-sans p-6">
      {/* Settings Modal Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#2D2B3D] w-full max-w-lg rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <Settings className="size-6 text-emerald-500" />
                <h2 className="text-xl font-bold">Device Settings</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full hover:bg-white/10"
              >
                <XCircle className="size-6 text-white/40" />
              </Button>
            </div>
            <div className="p-8">
              <DeviceSettings />
            </div>
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end">
              <Button 
                onClick={() => setIsSettingsOpen(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 font-bold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      <ParticipantsAudio participants={participants} />
      
      {/* Top Window Controls */}
      <div className="flex items-center justify-end gap-3 mb-4 pr-4">
        <div 
          onClick={toggleFullScreen}
          className="size-3 rounded-full bg-[#00D084] cursor-pointer hover:scale-125 transition-all shadow-lg shadow-emerald-500/20" 
          title="Toggle Fullscreen"
        />
        <div 
          onClick={handleMinimize}
          className="size-3 rounded-full bg-[#FFB800] cursor-pointer hover:scale-125 transition-all shadow-lg shadow-amber-500/20" 
          title="Minimize"
        />
        <div 
          onClick={handleLeaveCall}
          className="size-3 rounded-full bg-[#FF4B4B] cursor-pointer hover:scale-125 transition-all shadow-lg shadow-rose-500/20" 
          title="End Meeting"
        />
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left: Video Grid Area */}
        <div className="flex-[3] flex flex-col gap-6 overflow-hidden">
          {/* Main View: Focuses on Agent or Pinned Participant */}
           <div className={cn(
             "flex-[2.2] relative rounded-[40px] bg-[#2D2B3D] border-4 overflow-hidden shadow-2xl transition-all duration-500 group shadow-emerald-500/5",
             pinnedParticipantId ? "border-[#00D084] shadow-[#00D084]/20" : "border-white/5"
           )}>
             {mainParticipant ? (
               <div className="absolute inset-0">
                 <ParticipantView 
                   participant={mainParticipant} 
                   ParticipantViewUI={null}
                   mirror={mainParticipant.sessionId === localParticipant?.sessionId}
                 />
                 {!hasVideo(mainParticipant) && (
                   <div className="absolute inset-0 flex items-center justify-center bg-[#2D2B3D]">
                     <div className="size-56 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                       <Users className="size-24 text-white/10" />
                     </div>
                   </div>
                 )}
                 
                 {/* Name Tag */}
                 <div className="absolute bottom-10 left-10 z-10 flex flex-col gap-2">
                   <div className="px-4 py-2 bg-[#00D084]/10 backdrop-blur-md border border-[#00D084]/20 rounded-full self-start">
                     <span className="text-xs font-bold text-[#00D084] uppercase tracking-widest">
                       {mainParticipant.userId.startsWith('agent-') ? 'AI AGENT' : 'PARTICIPANT'}
                     </span>
                   </div>
                   <h3 className="text-4xl font-black text-white drop-shadow-2xl">
                     {mainParticipant.name || "User"}
                   </h3>
                 </div>

                 {/* Mic Status */}
                 <div className="absolute bottom-10 right-10 z-10">
                   <div className="size-14 rounded-full bg-[#1F1D2B]/80 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-xl">
                     <Mic className={cn(
                       "size-7",
                       !hasAudio(mainParticipant) ? "text-red-500" : "text-white"
                     )} />
                   </div>
                 </div>
  
                 {/* Expand Icon - Toggles Pinning */}
                 <div 
                   onClick={() => setPinnedParticipantId(pinnedParticipantId ? null : mainParticipant.sessionId)}
                   className="absolute top-10 right-10 z-10 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                 >
                   <div className={cn(
                     "p-3 rounded-2xl backdrop-blur-md border transition-all",
                     pinnedParticipantId ? "bg-[#00D084] border-[#00D084] text-white shadow-lg shadow-[#00D084]/20" : "bg-black/20 border-white/10 text-white"
                   )}>
                     <Maximize2 className="size-6" />
                   </div>
                 </div>
               </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#2D2B3D]">
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw className="size-12 text-white/10 animate-spin" />
                  <p className="text-white/20 font-medium">Initializing Stream...</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Grid: Shows other participants */}
          <div className="flex-1 flex gap-6">
            {gridParticipants.map((p) => (
              <div key={p.sessionId} className="flex-1 relative rounded-[40px] bg-[#2D2B3D] border border-white/5 overflow-hidden group">
                <div className="absolute inset-0">
                  <ParticipantView 
                    participant={p} 
                    ParticipantViewUI={null}
                    mirror={p.sessionId === localParticipant?.sessionId}
                  />
                  {!hasVideo(p) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#2D2B3D]">
                      <div className="size-28 rounded-full bg-white/5 flex items-center justify-center">
                        <Users className="size-12 text-white/10" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-8 left-10 z-10">
                  <span className="text-lg font-bold text-white/40">
                    {p.sessionId === localParticipant?.sessionId ? 'You (Local)' : (p.name || "Participant")}
                  </span>
                </div>
                <div className="absolute bottom-8 right-10 z-10">
                  {!hasAudio(p) ? (
                    <MicOff className="size-5 text-red-500" />
                  ) : (
                    <Mic className="size-5 text-white/20" />
                  )}
                </div>
                <div 
                  onClick={() => setPinnedParticipantId(p.sessionId)}
                  className="absolute top-8 right-10 z-10 opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-white">
                    <Maximize2 className="size-4" />
                  </div>
                </div>
              </div>
            ))}

            {/* If there's only one grid participant and no agent, show a placeholder */}
            {gridParticipants.length < 2 && !agentParticipant && (
              <div className="flex-1 relative rounded-[40px] bg-[#2D2B3D] border border-white/5 overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center bg-[#2D2B3D]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-28 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                      <Users className="size-12 text-white/5" />
                    </div>
                    <span className="text-sm font-medium text-white/20">Waiting for Agent...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar Panel */}
        <div className="flex-1 bg-[#2D2B3D] rounded-[40px] flex flex-col overflow-hidden border border-white/5 shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-10 pb-6 flex items-center justify-between border-b border-white/5">
            <h2 className="text-2xl font-bold text-white/90">
              {activeTab === 'chat' ? 'Meeting Chat' : `Participants (${participants.length})`}
            </h2>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab('chat')}
                className={cn(
                  "size-10 rounded-xl transition-all",
                  activeTab === 'chat' ? "bg-emerald-500/10 text-emerald-500" : "text-white/40 hover:text-white"
                )}
              >
                <MessageSquare className="size-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab('participants')}
                className={cn(
                  "size-10 rounded-xl transition-all",
                  activeTab === 'participants' ? "bg-emerald-500/10 text-emerald-500" : "text-white/40 hover:text-white"
                )}
              >
                <Users className="size-6" />
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 scrollbar-hide py-8">
            {activeTab === 'chat' ? (
              /* Chat Messages */
              <div className="space-y-10">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex items-start gap-4",
                    msg.userId === localParticipant?.userId ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "size-12 rounded-full flex-shrink-0 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden",
                      msg.isAgent ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/20"
                    )}>
                      {msg.isAgent ? <CircleDot className="size-6" /> : (
                        <div className="size-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                          {msg.user.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "space-y-2 max-w-[80%]",
                      msg.userId === localParticipant?.userId ? "items-end text-right" : "items-start text-left"
                    )}>
                      <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-[0.2em]">{msg.user}</p>
                      <div className={cn(
                        "px-5 py-3 rounded-[20px] text-sm font-medium leading-relaxed break-words",
                        msg.userId === localParticipant?.userId ? "bg-[#3D3B4D] text-white/90" : "bg-white/5 text-white/70"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Participants List */
              <div className="space-y-6">
                {participants.map((p) => (
                  <div key={p.sessionId} className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        {p.image ? (
                          <img src={p.image} alt="" className="size-full rounded-full object-cover" />
                        ) : (
                          <Users className="size-6 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white/90">
                          {p.name || "Anonymous"}
                          {p.sessionId === localParticipant?.sessionId && " (You)"}
                          {p.userId.startsWith('agent-') && " (Agent)"}
                        </span>
                        <span className="text-[10px] text-white/40 font-medium">
                          {p.userId.startsWith('agent-') ? 'Connected' : 'Participant'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!hasAudio(p) ? (
                        <MicOff className="size-4 text-red-500" />
                      ) : (
                        <Mic className="size-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-8 pt-4 flex items-center gap-4">
            {activeTab === 'chat' ? (
              <form onSubmit={sendMessage} className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="size-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20 flex-shrink-0"
                >
                  <Send className="size-6" />
                </Button>
              </form>
            ) : (
              <div className="flex-1 flex justify-end">
                <div className="size-14 rounded-[20px] bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all border border-white/10 shadow-lg">
                  <UserPlus className="size-7 text-white/60" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Control Bar Area */}
      <div className="h-40 flex items-center justify-between px-4">
        {/* Left Side: Layout Controls */}
        <div className="flex items-center gap-10">
          <div onClick={() => setIsSpeakerMuted(!isSpeakerMuted)} className="cursor-pointer group">
            {isSpeakerMuted ? (
              <VolumeX className="size-8 text-red-500 transition-colors" />
            ) : (
              <Volume2 className="size-8 text-white/40 group-hover:text-white transition-colors" />
            )}
          </div>
          <CircleDot 
            onClick={toggleRecording}
            className={cn(
              "size-8 cursor-pointer transition-colors",
              isRecording ? "text-red-500 animate-pulse" : "text-white/40 hover:text-white"
            )} 
          />
          <Share 
            onClick={toggleScreenShare}
            className={cn(
              "size-8 cursor-pointer transition-colors",
              isScreenSharing ? "text-emerald-500" : "text-white/40 hover:text-white"
            )} 
          />
          <Settings 
            onClick={() => setIsSettingsOpen(true)}
            className="size-8 text-white/40 cursor-pointer hover:text-white transition-colors" 
          />
          <Users 
            onClick={() => setActiveTab('participants')}
            className={cn(
              "size-8 cursor-pointer transition-colors",
              activeTab === 'participants' ? "text-emerald-500" : "text-white/40 hover:text-white"
            )} 
          />
          <Layout 
            onClick={() => toast.info("Layout switching will be available in the next update")}
            className="size-8 text-white/40 cursor-pointer hover:text-white transition-colors" 
          />
        </div>

        {/* Right Side: Media Controls */}
        <div className="flex items-center gap-8">
          <Button
            onClick={() => call.microphone.toggle()}
            className={cn(
              "size-20 rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95",
              isMicMuted ? "bg-[#3D3B4D] text-white/40" : "bg-[#00D084] text-white"
            )}
          >
            {isMicMuted ? <MicOff className="size-8" /> : <Mic className="size-8" />}
          </Button>

          <Button
            onClick={() => call.camera.toggle()}
            className={cn(
              "size-20 rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95",
              isCamMuted ? "bg-[#3D3B4D] text-white/40" : "bg-[#FFB800] text-white"
            )}
          >
            {isCamMuted ? <VideoOff className="size-8" /> : <Video className="size-8" />}
          </Button>

          <Button
            onClick={handleLeave}
            className="size-20 rounded-full bg-[#FF4B4B] hover:bg-red-600 text-white transition-all shadow-2xl shadow-red-500/20 hover:scale-105 active:scale-95"
          >
            <LogOutIcon className="size-8 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};
