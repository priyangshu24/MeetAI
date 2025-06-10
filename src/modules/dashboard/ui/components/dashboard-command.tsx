import { Dispatch, SetStateAction } from "react";

import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { CommandItem } from "cmdk";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Find a meeting or agent" />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandDialog>
  );
};
