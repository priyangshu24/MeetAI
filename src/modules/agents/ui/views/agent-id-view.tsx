"use client";

import { ErrorState } from "@/components/error-state";
import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";

import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateAgentDialog } from "../components/update-agent-dialog"



interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const [UpdateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  

  const { data } = useSuspenseQuery(
    trpc.agent.getOne.queryOptions({
      id: agentId,
    })
  );

  const removeAgent = useMutation(
    trpc.agent.remove.mutationOptions({
      onSuccess: async() => {
        await queryClient.invalidateQueries(trpc.agent.getMany.queryOptions({}));
        // TODO: Invalidated free tier usage
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },     
    }),
  )

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meeting.`,
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId })
  };  

  return (
    <>
    <RemoveConfirmation/>
    <UpdateAgentDialog 
        open={UpdateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
    />
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => setUpdateAgentDialogOpen(true) }
        onRemove={handleRemoveAgent}
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              variant="botttsNetural"
              seed={data.name}
              className="size-10"
            />
            <h2 className="text-2xl font-medium">{data.name}</h2>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon className="text-blue-700" />
            {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
            {/* Agent ID: {data.id} */}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p  className="font-medium text-xl">Instruction</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds"
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Loading Agent Error"
      description="Please try again later"
    />
  );
};
