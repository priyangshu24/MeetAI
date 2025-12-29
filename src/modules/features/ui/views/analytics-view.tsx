"use client";

import { BarChart3Icon, TrendingUpIcon, UsersIcon, MessageSquareIcon, BrainCircuitIcon, TargetIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const analyticsFeatures = [
  {
    title: "Engagement Scoring",
    description: "Measure participant interaction and engagement levels in real-time with our proprietary AI algorithms.",
    icon: TargetIcon,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Sentiment Analysis",
    description: "Track the emotional tone of your meetings to understand team morale and sentiment trends over time.",
    icon: MessageSquareIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "AI Action Tracking",
    description: "Automatically identify, assign, and track progress on action items discussed during your meetings.",
    icon: BrainCircuitIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Team Productivity",
    description: "Visualize meeting efficiency and productivity trends across your entire organization.",
    icon: TrendingUpIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Speaker Insights",
    description: "Analyze talk time distribution to ensure inclusive and balanced conversations in every session.",
    icon: UsersIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Historical Trends",
    description: "Compare current meeting metrics with historical data to track improvement and growth.",
    icon: BarChart3Icon,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  }
];

export const AnalyticsView = () => {
  const [heights, setHeights] = useState([40, 70, 45, 90, 65, 85, 30, 60, 95, 50, 75, 55]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const newHeights = heights.map(() => Math.floor(Math.random() * 70) + 30);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setHeights(newHeights);
    setIsRefreshing(false);
    toast.success("Analytics data updated", {
      description: "Showing the latest meeting performance metrics.",
    });
  };

  return (
    <div className="flex-1 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <header className="flex flex-col items-center text-center px-8 py-20 max-w-4xl mx-auto w-full relative z-10">
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6 animate-in fade-in zoom-in duration-500">
          <BarChart3Icon className="size-12 text-rose-500" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-rose-500 via-pink-500 to-purple-600 mb-6 drop-shadow-sm leading-tight">
          Advanced Meeting <br /> Analytics
        </h1>
        <p className="text-muted-foreground text-xl font-medium italic tracking-wide opacity-80 max-w-2xl">
          Transform your meeting data into actionable insights with our comprehensive analytics suite.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Mock Chart Section */}
        <div className="mb-20 p-8 rounded-[40px] bg-primary/5 border border-primary/10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tighter">Performance Overview</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCwIcon className={cn("size-5", isRefreshing && "animate-spin")} />
              </button>
              <div className="flex gap-2">
                <div className="size-3 rounded-full bg-rose-500" />
                <div className="size-3 rounded-full bg-blue-500" />
                <div className="size-3 rounded-full bg-purple-500" />
              </div>
            </div>
          </div>
          <div className="flex items-end gap-4 h-64">
            {heights.map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-linear-to-t from-rose-500/20 to-rose-500 rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-80"
                style={{ height: `${height}%`, transitionDelay: `${i * 20}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Sentiment Analysis Section */}
        <div className="mb-20 p-12 rounded-[40px] bg-linear-to-br from-rose-500/10 via-background to-transparent border border-rose-500/20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-black tracking-tighter">AI-Powered Sentiment</h2>
              <p className="text-lg text-muted-foreground font-medium italic">
                Our advanced NLP models analyze vocal tones and word choices to provide a comprehensive sentiment map of your meetings.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-sm">92% Positive</div>
                <div className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-sm">8% Neutral</div>
              </div>
            </div>
            <div className="flex-1 w-full grid grid-cols-5 gap-2 items-end h-32">
              {[30, 45, 90, 65, 80].map((h, i) => (
                <div key={i} className="bg-rose-500/20 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-rose-500 rounded-t-lg transition-all duration-1000"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsFeatures.map((feature, index) => (
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