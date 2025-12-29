"use client";

import { BotIcon, StarIcon, VideoIcon, SearchIcon, ShieldCheckIcon, BarChart3Icon, ZapIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { useState, useEffect } from "react";
import { DashboardCommand } from "./dashboard-command";

import { 
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    // SidebarSeparator,
    SidebarMenuItem, 
    useSidebar} from "@/components/ui/sidebar";

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    },
]

const statsSection = [
    {
        icon: ShieldCheckIcon,
        label: "Security",
        color: "text-emerald-500",
        href: "/security",
    },
    {
        icon: BarChart3Icon,
        label: "Analytics",
        color: "text-rose-500",
        href: "/analytics",
    },
    {
        icon: ZapIcon,
        label: "Speed",
        color: "text-cyan-500",
        href: "/speed",
    },
]

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/Upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();
    const { state } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <Sidebar collapsible="icon" className="glass border-r-0">
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
            <SidebarHeader className="text-sidebar-account-foreground"> 
                {/* Traffic Light Dots */}
                <div className={cn(
                    "flex items-center gap-2 px-4 pt-4 transition-all duration-300",
                    state === "collapsed" && "opacity-0 translate-x-[-20px] pointer-events-none"
                )}>
                    <div className="size-3 rounded-full bg-[#00D084] shadow-lg shadow-emerald-500/20" />
                    <div className="size-3 rounded-full bg-[#FFB800] shadow-lg shadow-amber-500/20" />
                    <div className="size-3 rounded-full bg-[#FF4B4B] shadow-lg shadow-rose-500/20" />
                </div>

                <Link href="/" className={cn(
                    "flex items-center gap-2 px-2 pt-6 transition-all duration-300",
                    state === "collapsed" && "opacity-0 translate-x-[-20px] pointer-events-none"
                )}>
                    <Image src="/logo.svg" width={36} height={36} alt="Meet AI" />
                    <p className="text-2xl font-bold tracking-tighter">Meet AI</p>
                </Link>
            </SidebarHeader>

            <div className={cn("transition-all duration-300", state === "collapsed" ? "px-1 py-4" : "px-4 py-4")}>
                <Separator className="opacity-10"/> 
            </div>

            <SidebarContent>
                <SidebarGroup className={cn("transition-all duration-300", state === "collapsed" ? "p-0" : "p-2")}>
                    <SidebarGroupContent className={cn("transition-all duration-300", state === "collapsed" ? "px-0" : "px-2")}>
                        <SidebarMenu>
                            <SidebarMenuItem className="flex justify-center w-full">
                                <SidebarMenuButton 
                                    onClick={() => setCommandOpen(true)}
                                    tooltip="Search (Ctrl+K)"
                                    className={cn(
                                        "rounded-xl bg-primary/5 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-primary/10 transition-all duration-300",
                                        state === "collapsed" ? "size-10 p-0 justify-center" : "h-12 px-4"
                                    )}
                                >
                                    <SearchIcon className={cn("transition-all duration-300 shrink-0", state === "collapsed" ? "size-6" : "size-5")} />
                                    {state === "expanded" && (
                                        <>
                                            <span className="text-lg font-medium ml-2">Search...</span>
                                            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                                <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
                                            </kbd>
                                        </>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className={cn("transition-all duration-300", state === "collapsed" ? "p-0" : "p-2")}>
                    <SidebarGroupContent className={cn("transition-all duration-300", state === "collapsed" ? "px-0" : "px-2")}>
                        <SidebarMenu className="gap-y-1">
                            {firstSection.map((item)=>(
                                <SidebarMenuItem key={item.href} className="flex justify-center w-full">
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        className={cn(
                                            "transition-all duration-300",
                                            state === "collapsed" ? "size-10 p-0 justify-center rounded-xl" : "h-11 px-4 rounded-xl",
                                            "hover:bg-primary/10 hover:text-primary",
                                            pathname === item.href ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20" : "text-muted-foreground"
                                        )}
                                        isActive={pathname === item.href}
                                     >
                                        <Link href={item.href} className="flex items-center gap-x-3">
                                            <item.icon className={cn("shrink-0 transition-all duration-300", state === "collapsed" ? "size-6" : "size-6", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                                            {state === "expanded" && (
                                                <span className="text-base font-semibold">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>    
                    </SidebarGroupContent>     
                </SidebarGroup>

                <SidebarGroup className={cn("transition-all duration-300", state === "collapsed" ? "p-0" : "p-2")}>
                    <SidebarGroupContent className={cn("transition-all duration-300", state === "collapsed" ? "px-0" : "px-2")}>
                        <SidebarMenu className="gap-y-1">
                            {statsSection.map((item)=>(
                                <SidebarMenuItem key={item.href} className="flex justify-center w-full">
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        className={cn(
                                            "transition-all duration-300 hover:bg-primary/5 text-muted-foreground hover:text-primary",
                                            state === "collapsed" ? "size-10 p-0 justify-center rounded-xl" : "h-11 px-4 rounded-xl"
                                        )}
                                     >
                                        <Link href={item.href} className="flex items-center gap-x-3">
                                            <item.icon className={cn("shrink-0 transition-all duration-300", state === "collapsed" ? "size-6" : "size-6", item.color)} />
                                            {state === "expanded" && (
                                                <span className="text-base font-semibold uppercase tracking-wider">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className={cn("mt-auto py-4 space-y-4 transition-all duration-300", state === "collapsed" ? "px-0" : "px-2")}>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex justify-center w-full">
                            <SidebarMenuButton
                                asChild
                                tooltip="Upgrade to PRO"
                                className={cn(
                                    "rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-500 shadow-lg shadow-orange-500/5 group",
                                    state === "collapsed" ? "size-10 p-0 justify-center" : "h-14 px-4"
                                )}
                            >
                                <Link href="/upgrade" className="flex items-center gap-x-3">
                                    <SparklesIcon className={cn("fill-orange-500/20 group-hover:scale-110 transition-transform duration-300 shrink-0", state === "collapsed" ? "size-6" : "size-6")} />
                                    {state === "expanded" && (
                                        <span className="text-lg font-black tracking-tighter uppercase">PRO PLAN</span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <SidebarMenu className="gap-y-2">
                        {secondSection.map((item)=>(
                            <SidebarMenuItem key={item.href} className="flex justify-center w-full">
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.label}
                                    className={cn(
                                        "transition-all duration-300 bg-primary/10 hover:bg-primary/20 text-primary",
                                        state === "collapsed" ? "size-10 p-0 justify-center rounded-xl" : "h-11 px-4 rounded-xl"
                                    )}
                                >
                                    <Link href={item.href} className="flex items-center gap-x-3">
                                        <item.icon className={cn("fill-primary shrink-0 transition-all duration-300", state === "collapsed" ? "size-6" : "size-5")} />
                                        {state === "expanded" && (
                                            <span className="text-[15px] font-bold">
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu> 
                </div>
            </SidebarContent>
            <SidebarFooter className={cn("border-t border-border/50 transition-all duration-300", state === "collapsed" ? "p-1" : "p-4")}>
                <DashboardUserButton/>
            </SidebarFooter>
        </Sidebar>
    )
}