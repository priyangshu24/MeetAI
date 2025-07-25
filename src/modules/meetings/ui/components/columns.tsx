"use client";

import { format } from "date-fns"; // fixed typo: was "data-fns"
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
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-green-500/20 text-green-800 border-green-800/5",
  processing: "bg-purple-500/20 text-purple-800 border-purple-800/5",
  cancelled: "bg-red-500/20 text-red-800 border-red-800/5",
} as const;

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
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
          {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Fix: Extract status type casting to avoid repeated type assertions
      // This resolves the "Argument of type '{}' is not assignable" error on line 291
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
      const duration =
        typeof row.original.duration === "number"
          ? row.original.duration
          : undefined;
      return (
        <Badge
          variant="outline"
          className="capitalize [&>svg]:size-4 text-muted-foreground"
        >
          <ClockFadingIcon className="text-blue-700" />
          {duration !== undefined ? formatDuration(duration) : "No Duration"}
        </Badge>
      );
    },
  },
];