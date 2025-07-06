import { ReactNode, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    CommandEmpty,
    CommandList,
    CommandItem,
    CommandInput,
    CommandResponsiveDialog,
} from "@/components/ui/command";

interface Props {
    options: Array<{
        id:string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string)=> void;
    onSearch?: (value: string) => void;
     value: string;
     placeholder?: string;
     isSearchable?: boolean;
     className?: string;  
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder,
    className,
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectOption = options.find((option)=> option.value === value)
    return (
        <>
          <Button 
            onClick={() => setOpen(true)}
            type="button"
            variant="outline"
            className={cn(
                "h-9 justify-between font-normal px-2",
                !selectOption && "text-muted-foreground",
                className,
            )}
          >
            <div>
                {selectOption?.children ?? placeholder }
            </div>
            <ChevronDownIcon />
          </Button>
          <CommandResponsiveDialog
             shouldFilter={!onSearch}
             open={open}
             onOpenChange={setOpen}
          >
            <CommandInput placeholder="search..." onValueChange={onSearch}/>
            <CommandList>
                <CommandEmpty>
                    <span className="text-muted-foreground text-sm">
                        No results found.
                    </span>
                </CommandEmpty>
                 {options.map((option)=> (
                    <CommandItem
                        key={option.id}
                        onSelect={()=>{
                            onSelect(option.value);
                            setOpen(false);
                        }}
                    >
                        {option.children}
                    </CommandItem>
                 ))}
            </CommandList>
          </CommandResponsiveDialog>
        </>
    )
};