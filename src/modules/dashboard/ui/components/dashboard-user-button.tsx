// Importing necessary components and icons from libraries

import React, { forwardRef } from "react";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Importing authClient from the authentication library

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Importing UI components for the dropdown menu and avatar

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { useSidebar } from "@/components/ui/sidebar";

interface UserTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: NonNullable<ReturnType<typeof authClient.useSession>["data"]>;
  state?: "expanded" | "collapsed";
}

const UserTrigger = forwardRef<HTMLButtonElement, UserTriggerProps>(
  ({ className, data, state, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "rounded-xl border border-primary/10 transition-all duration-300 bg-primary/5 hover:bg-primary/10 flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        state === "collapsed" ? "size-10 p-0 justify-center" : "p-2.5 w-full justify-between gap-x-3",
        className
      )}
      {...props}
    >
      <div className={cn("flex items-center min-w-0", state === "collapsed" ? "justify-center" : "gap-3 flex-1")}>
        {data.user.image ? (
          <Avatar className={cn("border border-primary/10 transition-all duration-300", state === "collapsed" ? "size-8" : "size-9")}>
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="botttsNetural"
            className={cn("shrink-0 shadow-sm transition-all duration-300", state === "collapsed" ? "size-8" : "size-9")}
          />
        )}
        {state === "expanded" && (
          <div className="flex flex-col text-left overflow-hidden">
            <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {data.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate font-medium">
              {data.user.email}
            </p>
          </div>
        )}
      </div>
      {state === "expanded" && (
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </button>
  )
);
UserTrigger.displayName = "UserTrigger";

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const { data, isPending } = authClient.useSession();

  const onLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to logout");
        }
      },
    });
  };

  if (isPending || !data?.user) {
    return (
      <div className="h-14 w-full animate-pulse bg-primary/5 rounded-xl border border-primary/10" />
    );
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <UserTrigger data={data} state={state} />
        </DrawerTrigger>
        <DrawerContent className="rounded-t-[2rem]">
          <DrawerHeader className="pb-4">
            <div className="flex flex-col items-center gap-4">
               {data.user.image ? (
                <Avatar className="size-16 border-2 border-primary/20">
                  <AvatarImage src={data.user.image} />
                </Avatar>
              ) : (
                <GeneratedAvatar
                  seed={data.user.name}
                  variant="botttsNetural"
                  className="size-16"
                />
              )}
              <div className="text-center">
                <DrawerTitle className="text-xl font-bold">{data.user.name}</DrawerTitle>
                <DrawerDescription className="text-sm font-medium mt-1">{data.user.email}</DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <DrawerFooter className="gap-3 px-6 pb-8">
            <Button variant="outline" className="h-12 rounded-xl border-2 font-semibold" onClick={() => {}}>
              <CreditCardIcon className="size-5 mr-2" />
              Billing
            </Button>
            <Button variant="destructive" className="h-12 rounded-xl font-semibold shadow-lg shadow-destructive/20" onClick={onLogout}>
              <LogOutIcon className="size-5 mr-2" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserTrigger data={data} state={state} />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side={state === "collapsed" ? "right" : "bottom"} 
        sideOffset={state === "collapsed" ? 20 : 12}
        className="w-72 p-2 rounded-2xl shadow-xl border-primary/10 bg-background/95 backdrop-blur-sm z-[100]"
      >
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm tracking-tight">{data.user.name}</span>
            <span className="text-xs font-medium text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/10" />
        <DropdownMenuItem className="p-3 cursor-pointer rounded-xl flex items-center justify-between hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary transition-all duration-200">
          <span className="font-semibold text-sm">Billing</span>
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="p-3 cursor-pointer rounded-xl flex items-center justify-between text-destructive hover:bg-destructive/5 hover:text-destructive focus:bg-destructive/5 focus:text-destructive transition-all duration-200"
        >
          <span className="font-semibold text-sm">Logout</span>
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
