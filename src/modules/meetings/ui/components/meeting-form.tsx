"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MeetingGetOne } from "../../types";
import { meetingsInertSchema} from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTRPC } from "@/trpc/client";

import { CommandSelect } from "@/components/command-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { useState } from "react";

import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";


interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewAgentDialog ,setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch ] = useState("");

  const agents = useQuery(
    trpc.agent.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async(data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        )
        //TODO: Invalidate free tier usage

        onSuccess?.(data.id)
      },
      onError: (error) => {
        toast.error(error.message)

    //TODO: check if error code is "FORBIDDEN", redirect "/upgrade"
      },
    })
  );

  const UpdateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async() => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        )

        if(initialValues?.id){
            await queryClient.invalidateQueries(
                trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
            )
        }

        onSuccess?.()
      },
      onError: (error) => {
        toast.error(error.message)

    //TODO: check if error code is "FORBIDDEN", redirect "/upgrade"
      },
    })
  );
  const form = useForm<z.infer<typeof meetingsInertSchema>>({
    resolver: zodResolver(meetingsInertSchema),
    defaultValues: {
        name: initialValues?.name ?? "",
        agentId: initialValues?.agentId ??"",
    }
  });

  const isEdit = !! initialValues?.id;
  const isPending = createMeeting.isPending || UpdateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInertSchema>) => {
    if (isEdit) {
        UpdateMeeting.mutate({ ...values, id: initialValues.id })
    } else {
        createMeeting.mutate(values);
    }
  };


  return (
    <>
    <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog}/>
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* <GeneratedAvatar 
             seed={form.watch("name")}
             variant="botttsNetural"
             className="border size-16" 
             /> */}
            <FormField 
              name="name"
              control={form.control}
              render= {({field})=>(
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Meeting" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              name="agentId"
              control={form.control}
              render= {({field})=>(
                <FormItem>
                    <FormLabel>Agent</FormLabel>
                    <FormControl>
                      <CommandSelect
                        options={(agents.data?.items ?? []).map((agent)=>({
                          id: agent.id,
                          value: agent.id,
                          children: (
                            <div className="flex items-center gap-x-2">
                              <GeneratedAvatar
                                seed={agent.name}
                                variant="botttsNetural"
                                className="size-6 border"
                              />
                              <span>{agent.name}</span>
                            </div>
                          ) 
                        }))}
                        onSelect={field.onChange}
                        onSearch={setAgentSearch}
                        value={field.value}
                        placeholder="Select an agent"
                        />
                    </FormControl>
                    <FormDescription>
                      Not found what you&apos;re looking for?{" "}
                      <button
                       type="button"
                       className="text-primary hover:underline"
                       onClick={()=> setOpenNewAgentDialog(true)}
                      >
                        Create new agent
                      </button>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex justify-between gap-x-2">
                {onCancel && (
                    <Button
                        variant="ghost"
                        disabled={isPending}
                        type="button"
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </Button>
                )}
                <Button disabled={isPending} type="submit">
                    {isEdit ? "Update" : "Create"}
                </Button>
             </div>
        </form>
    </Form>   
    </> 
  );
};
