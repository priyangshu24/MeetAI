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
        <Sidebar>
            <SidebarHeader className="text-sidebar-account-foreground"> 
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                <Image src="/logo.svg" width={36} height={36} alt="Meet AI" />
                <p className="text-2xl font-semibold">Meet AI</p>
                </Link>
            </SidebarHeader>

            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]"/> 
            </div>

            <SidebarContent>

                {/* First Section */}

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item)=>(
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                    asChild
                                     className={cn("h-10 hover:bg-linear-to-r/okch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50% to-sidebar/50" ,
                                        
                                    pathname === item.href && "bg-inear-to-r/oklch border-[#5D6B68]/10"    
                                     )}
                                     isActive={pathname === item.href}
                                     >
                                        <Link href={item.href}>
                                        <item.icon className="size-5" />
                                        <span className="text-sm font-medium tracking-tight">
                                            {item.label}
                                        </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>    
                    </SidebarGroupContent>     
                </SidebarGroup>

                {/* Separator */}
                <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]"/> 
                </div>
                
                {/* Second Section */}

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item)=>(
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                    asChild
                                     className={cn("h-10 hover:bg-linear-to-r/okch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50% to-sidebar/50" ,
                                        
                                    pathname === item.href && "bg-inear-to-r/oklch border-[#5D6B68]/10"    
                                     )}
                                     isActive={pathname === item.href}
                                     >
                                        <Link href={item.href}>
                                        <item.icon className="size-5" />
                                        <span className="text-sm font-medium tracking-tight">
                                            {item.label}
                                        </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>    
                    </SidebarGroupContent>     
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white">
                <DashboardUserButton/>

            </SidebarFooter>
        </Sidebar>

    )
}