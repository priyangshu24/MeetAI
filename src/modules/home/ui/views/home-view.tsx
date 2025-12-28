"use client";

import { useState } from "react";
import { BentoGrid, BentoGridItem } from "../components/bento-grid";
import { HomeCarousel } from "../components/home-carousel";
import { Newsletter } from "../components/newsletter";
import { QuickActions } from "../components/quick-actions";
import { ThemeToggleSwitch } from "@/components/theme-toggle-switch";
import { Footer } from "../components/footer";
import { 
  Bot, 
  Video, 
  Sparkles, 
  Shield, 
  Zap, 
  BarChart3 
} from "lucide-react";
import { NewAgentDialog } from "../../../agents/ui/components/new-agent-dialog";
import { NewMeetingDialog } from "../../../meetings/ui/components/new-meeting-dialog";

export const HomeView = () => {
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);

  const handleCreateAgent = () => {
    setIsAgentDialogOpen(true);
  };

  const handleCreateMeeting = () => {
    setIsMeetingDialogOpen(true);
  };

  return (
    <div className="flex-1 pb-10 relative">
      <NewAgentDialog 
        open={isAgentDialogOpen} 
        onOpenChange={setIsAgentDialogOpen} 
      />
      <NewMeetingDialog 
        open={isMeetingDialogOpen} 
        onOpenChange={setIsMeetingDialogOpen} 
      />
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full relative z-10">
        <div>
           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-emerald-600">
             Dashboard
           </h1>
           <p className="text-muted-foreground text-sm">Welcome back to Meet AI</p>
        </div>
        <ThemeToggleSwitch />
      </header>

      <div className="relative z-10">
        <QuickActions 
          onNewMeeting={handleCreateMeeting}
          onNewAgent={handleCreateAgent}
        />

        <BentoGrid className="mb-10">
          <BentoGridItem
            title="Active Meetings"
            description="View and manage your ongoing AI-powered sessions."
            header={<div className="flex items-center justify-center h-full w-full min-h-[6rem] rounded-xl bg-linear-to-br from-blue-500/10 to-blue-600/10"><Video className="size-12 text-blue-500" /></div>}
            icon={<Video className="size-4" />}
            size="2x1"
            className="md:col-span-2"
            onClick={handleCreateMeeting}
          />
          <BentoGridItem
            title="AI Agents"
            description="Configure your specialized virtual assistants."
            header={<div className="flex items-center justify-center h-full w-full min-h-[6rem] rounded-xl bg-linear-to-br from-purple-500/10 to-purple-600/10"><Bot className="size-12 text-purple-500" /></div>}
            icon={<Bot className="size-4" />}
            size="1x1"
            onClick={handleCreateAgent}
          />
          <BentoGridItem
            title="Pro Features"
            description="Unlock advanced capabilities with Meet AI Pro."
            header={<div className="flex items-center justify-center h-full w-full min-h-[6rem] rounded-xl bg-linear-to-br from-amber-500/10 to-amber-600/10"><Sparkles className="size-12 text-amber-500" /></div>}
            icon={<Sparkles className="size-4" />}
            size="1x1"
          />
          <BentoGridItem
            title="Security First"
            description="Your data is encrypted and secure with our enterprise-grade infrastructure."
            header={<div className="flex items-center justify-center h-full w-full min-h-[10rem] rounded-xl bg-linear-to-br from-green-500/10 to-green-600/10"><Shield className="size-20 text-green-500" /></div>}
            icon={<Shield className="size-4" />}
            size="1x2"
          />
          <BentoGridItem
            title="Real-time Analytics"
            description="Track meeting performance and AI engagement metrics."
            header={<div className="flex items-center justify-center h-full w-full min-h-[6rem] rounded-xl bg-linear-to-br from-rose-500/10 to-rose-600/10"><BarChart3 className="size-12 text-rose-500" /></div>}
            icon={<BarChart3 className="size-4" />}
            size="2x1"
          />
          <BentoGridItem
            title="Lightning Fast"
            description="Experience zero-latency interactions with our optimized AI engine."
            header={<div className="flex items-center justify-center h-full w-full min-h-[6rem] rounded-xl bg-linear-to-br from-cyan-500/10 to-cyan-600/10"><Zap className="size-12 text-cyan-500" /></div>}
            icon={<Zap className="size-4" />}
            size="1x1"
          />
        </BentoGrid>

        <HomeCarousel />
        
        <Newsletter />
        
        <Footer />
      </div>
    </div>
  );
};
