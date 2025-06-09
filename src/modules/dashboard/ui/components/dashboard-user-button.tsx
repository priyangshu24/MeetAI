// Importing necessary components and icons from libraries

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Importing authClient from the authentication library

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// Importing UI components for the dropdown menu and avatar

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,   
} from "@/components/ui/dropdown-menu";

import { GeneratedAvatar } from "@/components/generated-avatar";



export const DashboardUserButton = () => {
        const router = useRouter();
        const { data, isPending } = authClient.useSession();
        const onLogout = async () => {
             authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/sign-in");
                    }
                }
            })
        }
        if (isPending || !data?.user){
            return null;
        }
    return (        
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/10 overflow-hidden">
            { data.user.image ? (
                <Avatar>
                    <AvatarImage src={data.user.image}/>
                </Avatar>
            ): (
                <GeneratedAvatar
                    seed={data.user.name}
                    variant="botttsNetural"
                    className="size-9 mr-3"
                />
            )}
            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 miv-w-0">
                <p className="text-sm truncate w-full">
                    {data.user.name}
                </p>
                <p className="text-xs truncate w-full">
                    {data.user.email}
                </p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right"
                className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">{data.user.name}</span>
                        <span className="text-xs font-normal truncate">{data.user.email}</span>

                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="size-4"/>
                </DropdownMenuItem> 
                <DropdownMenuItem 
                    onClick={onLogout} className="cursor-pointer flex items-center justify-between">
                 Logout
                    <LogOutIcon className="size-4"/>
                </DropdownMenuItem>  
            </DropdownMenuContent>
        </DropdownMenu>
    );
};