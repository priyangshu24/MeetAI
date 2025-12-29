"use client";

import { format } from "date-fns";
import humanizeDuration from "humanize-duration";
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheckIcon,
  CircleXIcon,
  CircleArrowDownIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MeetingGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, Trash2Icon, ExternalLinkIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}
const statusIconMap = {
  upcoming: CircleArrowDownIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
} as const;

const statusColorMap = {
  upcoming: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
  active: "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20",
  processing: "bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20",
} as const;

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: function ClickableMeetingCell({ row }) {
      const router = useRouter();
      return (
        <div
          className="flex flex-col gap-y-1 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg p-2 -m-2"
          onClick={() => router.push(`/meetings/${row.original.id}`)}
          title="View meeting details"
        >
          <span className="font-semibold capitalize">{row.original.name}</span>
          <div className="flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
              {row.original.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNetural"
            seed={row.original.agent.name}
            className="size-4"
          />
          <span>
            {row.original.startedAt ? format(new Date(row.original.startedAt), "MMM d") : ""}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusIconMap;
      const Icon = statusIconMap[status];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[status]
          )}
        >
          <Icon
            className={cn(
              row.original.status === "processing" && "animate-spin"
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = Number(row.original.duration);
      return (
        <div className="flex items-center gap-x-2 text-muted-foreground tabular-nums">
          <ClockFadingIcon className="size-4" />
          {duration ? formatDuration(duration) : "0s"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function ActionsCell({ row }) {
      const trpc = useTRPC();
      const router = useRouter();
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

      const removeMutation = useMutation(
        trpc.meeting.remove.mutationOptions({
          onSuccess: () => {
            toast.success("Meeting deleted");
            router.refresh();
          },
          onError: () => {
            toast.error("Failed to delete meeting");
          },
        })
      );

      return (
        <>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the meeting
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => removeMutation.mutate({ id: row.original.id })}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => router.push(`/meetings/${row.original.id}`)}
                className="gap-x-2"
              >
                <ExternalLinkIcon className="size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive gap-x-2"
              >
                <Trash2Icon className="size-4" />
                Delete Meeting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];