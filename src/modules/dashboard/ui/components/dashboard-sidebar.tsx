"use client";

import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

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
    SidebarMenuItem, } from "@/components/ui/sidebar";






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

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/Upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();

    // const pathname = "/agents";  For testing purposes, replace with usePathname() in production
    return (
        <Sidebar className="glass border-r-0">
            <SidebarHeader className="text-sidebar-account-foreground"> 
                <Link href="/" className="flex items-center gap-2 px-2 pt-4">
                <Image src="/logo.svg" width={36} height={36} alt="Meet AI" />
                <p className="text-2xl font-bold tracking-tighter">Meet AI</p>
                </Link>
            </SidebarHeader>

            <div className="px-4 py-4">
                <Separator className="opacity-10"/> 
            </div>

            <SidebarContent>

                {/* First Section */}

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-y-2">
                            {firstSection.map((item)=>(
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                    asChild
                                     className={cn(
                                        "h-11 px-4 rounded-xl transition-all duration-300",
                                        "hover:bg-primary/10 hover:text-primary",
                                        pathname === item.href ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20" : "text-muted-foreground"
                                     )}
                                     isActive={pathname === item.href}
                                     >
                                        <Link href={item.href} className="flex items-center gap-x-3">
                                        <item.icon className={cn("size-5", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                                        <span className="text-[15px] font-semibold">
                                            {item.label}
                                        </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>    
                    </SidebarGroupContent>     
                </SidebarGroup>

                <div className="mt-auto px-4 py-4">
                     <SidebarMenu className="gap-y-2">
                            {secondSection.map((item)=>(
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                    asChild
                                     className={cn(
                                        "h-11 px-4 rounded-xl transition-all duration-300 bg-primary/10 hover:bg-primary/20 text-primary",
                                     )}
                                     >
                                        <Link href={item.href} className="flex items-center gap-x-3">
                                        <item.icon className="size-5 fill-primary" />
                                        <span className="text-[15px] font-bold">
                                            {item.label}
                                        </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu> 
                </div>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-border/50">
                <DashboardUserButton/>
            </SidebarFooter>
        </Sidebar>

    )
}