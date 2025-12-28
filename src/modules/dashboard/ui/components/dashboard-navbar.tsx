"use client";

import { useEffect, useState } from "react";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Detect if user is on Mac
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
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-6 gap-x-4 items-center py-4 glass sticky top-0 z-50 border-t-0 border-x-0">
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
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-full sm:w-[280px] justify-start font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 rounded-xl px-4"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon className="size-4 mr-2" />
          Search everything...
          <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-6 select-none items-center gap-1 rounded-md border bg-muted px-2 font-mono text-[10px] font-bold text-muted-foreground">
            <span className="text-xs">
              {isMac ? "⌘" : "Ctrl"}
            </span>
            K
          </kbd>
        </Button>
      </nav>
    </>
  );
};