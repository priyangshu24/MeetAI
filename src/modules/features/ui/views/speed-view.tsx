"use client";

import { ZapIcon, TimerIcon, RocketIcon, CpuIcon, CloudLightningIcon, GaugeIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const speedFeatures = [
  {
    title: "Instant Transcription",
    description: "Our proprietary AI engine delivers near-zero latency transcription as people speak, with 99% accuracy.",
    icon: TimerIcon,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Global CDN",
    description: "Ultra-low latency audio and video delivery powered by our global edge network across 100+ locations.",
    icon: CloudLightningIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Real-time Summaries",
    description: "Get concise meeting summaries and action items the moment your meeting ends. No waiting required.",
    icon: ZapIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Hardware Acceleration",
    description: "Optimized for modern hardware to ensure smooth performance even on low-powered devices.",
    icon: CpuIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Instant Search",
    description: "Search across thousands of hours of meeting data in milliseconds with our lightning-fast indexing.",
    icon: RocketIcon,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Auto-Optimization",
    description: "Intelligent bandwidth management automatically adjusts quality to ensure a stable connection.",
    icon: GaugeIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  }
];

export const SpeedView = () => {
  const [latency, setLatency] = useState(0.2);
  const [isTesting, setIsTesting] = useState(false);

  const runSpeedTest = async () => {
    setIsTesting(true);
    setLatency(0);
    
    // Simulate speed test steps
    await new Promise(resolve => setTimeout(resolve, 800));
    setLatency(0.8);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLatency(0.1);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const finalLatency = Number((Math.random() * 0.2 + 0.1).toFixed(2));
    setLatency(finalLatency);
    setIsTesting(false);
    
    toast.success("Speed test complete!", {
      description: `Your current latency is ${finalLatency}s.`,
    });
  };

  return (
    <div className="flex-1 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <header className="flex flex-col items-center text-center px-8 py-20 max-w-4xl mx-auto w-full relative z-10">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 animate-in fade-in zoom-in duration-500">
          <ZapIcon className="size-12 text-cyan-500 fill-cyan-500/20" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-cyan-500 via-blue-500 to-amber-500 mb-6 drop-shadow-sm leading-tight">
          Lightning Fast <br /> Performance
        </h1>
        <p className="text-muted-foreground text-xl font-medium italic tracking-wide opacity-80 max-w-2xl">
          Speed isn&apos;t just a feature, it&apos;s our foundation. Experience the fastest AI meeting platform ever built.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Animated Speed Meter Section */}
        <div className="mb-20 p-12 rounded-[40px] bg-linear-to-br from-primary/5 via-primary/2 to-transparent border border-primary/10 relative overflow-hidden group flex flex-col items-center text-center">
          <div className="relative size-64 mb-8">
            <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                className="text-primary/5"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-cyan-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (1 - latency / 2))}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black tracking-tighter">{latency}s</span>
              <span className="text-sm font-bold text-muted-foreground uppercase">Latency</span>
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-4">Industry-Leading Latency</h2>
          <p className="text-lg font-medium text-muted-foreground italic max-w-xl mb-8">
            Our optimized processing pipeline ensures that your meetings stay in sync, no matter where your team is located.
          </p>
          <button 
            onClick={runSpeedTest}
            disabled={isTesting}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCwIcon className={cn("size-5", isTesting && "animate-spin")} />
            {isTesting ? "Testing Connection..." : "Run Speed Test"}
          </button>
        </div>

        {/* Speed Comparison Section */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-[40px] bg-primary/5 border border-primary/10">
            <h3 className="text-xl font-black tracking-tighter mb-6 uppercase text-muted-foreground">Traditional Platforms</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Transcription Delay</span>
                  <span>2.5s</span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full">
                  <div className="h-full bg-rose-500 w-[80%] rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Summary Generation</span>
                  <span>5.0m</span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full">
                  <div className="h-full bg-rose-500 w-[95%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-[40px] bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-xl font-black tracking-tighter mb-6 uppercase text-cyan-500">Meet AI Speed</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Transcription Delay</span>
                  <span>0.2s</span>
                </div>
                <div className="h-2 w-full bg-cyan-500/10 rounded-full">
                  <div className="h-full bg-cyan-500 w-[15%] rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Summary Generation</span>
                  <span>Instant</span>
                </div>
                <div className="h-2 w-full bg-cyan-500/10 rounded-full">
                  <div className="h-full bg-cyan-500 w-[5%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speedFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className={cn(
                "group p-8 rounded-3xl border border-primary/5 bg-primary/5 hover:bg-primary/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-8",
                `delay-[${index * 100}ms]`
              )}
            >
              <div className={cn("p-4 rounded-2xl w-fit mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", feature.bg)}>
                <feature.icon className={cn("size-8", feature.color)} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};