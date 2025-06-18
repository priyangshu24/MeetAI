import Link from "next/link";
import { ChevronRightIcon, TrashIcon, PencilIcon,MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuItem,

} from "@/components/ui/dropdown-menu";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";



interface Props {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export const AgentIdViewHeader = ({
    agentId, 
    agentName, 
    onEdit, 
    onRemove
}: Props) => {
  return (
    <div className="flex item-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-medium text-xl">
            <Link href="/agents">My Agents</Link>
            </BreadcrumbLink >
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4]">
             <ChevronRightIcon/>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
            <Link href={`/agents/${agentId}`}>
              {agentName}
            </Link>
            </BreadcrumbLink >
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Withot model={false}, the dialog that dropdown opens cause the website to get unclickable */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost">
                <MoreVerticalIcon className="size-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick = {onEdit}>
                <PencilIcon className="size-4 text-black" />
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick = {onRemove}>
                <TrashIcon className="size-4 text-black" />
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
