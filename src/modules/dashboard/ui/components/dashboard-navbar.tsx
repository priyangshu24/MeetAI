"use client";

import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
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
    <nav className="flex px-4 gap-x-4 items-center h-16 glass sticky top-0 z-50 border-t-0 border-x-0">
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <div className="flex items-center gap-x-4">
        <Button 
          className="size-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-200" 
          variant="outline" 
          onClick={toggleSidebar}
        >
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-5" />
          ) : (
            <PanelLeftCloseIcon className="size-5" />
          )}
        </Button>

        {/* Logo shown only when sidebar is collapsed */}
        <Link 
          href="/" 
          className={cn(
            "flex items-center gap-2 transition-all duration-300 transform",
            state === "expanded" && !isMobile ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
          )}
        >
          <Image src="/logo.svg" width={32} height={32} alt="Meet AI" />
          <p className="text-xl font-bold tracking-tighter">Meet AI</p>
        </Link>
      </div>

      {/* Search Bar in Navbar - Only shown when sidebar is collapsed */}
      {(state === "collapsed" || isMobile) && (
        <div className="flex-1 max-w-md ml-4 transition-all duration-500 animate-in fade-in slide-in-from-left-4">
          <Button
            onClick={() => setCommandOpen(true)}
            variant="outline"
            className="w-full h-10 justify-start text-muted-foreground bg-primary/5 border-primary/10 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300 group px-3"
          >
            <SearchIcon className="size-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-medium">Search anything...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
            </kbd>
          </Button>
        </div>
      )}
    </nav>
  );
};