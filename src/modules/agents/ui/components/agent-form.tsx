"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AgentGetOne } from "../../types";
import { agentsInertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agent.create.mutationOptions({
      onSuccess: async() => {
        await queryClient.invalidateQueries(
          trpc.agent.getMany.queryOptions(),
        )

        if(initialValues?.id){
            await queryClient.invalidateQueries(
                trpc.agent.getOne.queryOptions({ id: initialValues.id }),
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
  const form = useForm<z.infer<typeof agentsInertSchema>>({
    resolver: zodResolver(agentsInertSchema),
    defaultValues: {
        name: initialValues?.name ?? "",
        instructions: initialValues?.instructions ??"",
    }
  });

  const isEdit = !! initialValues?.id;
  const isPending = createAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInertSchema>) => {
    if (isEdit) {
        console.log("TODO: update agent")
    } else {
        createAgent.mutate(values);
    }
  };


  return (
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <GeneratedAvatar 
             seed={form.watch("name")}
             variant="botttsNetural"
             className="border size-16"
             />
            <FormField 
              name="name"
              control={form.control}
              render= {({field})=>(
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Agent Name" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name="instructions"
              control={form.control}
              render= {({field})=>(
                <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                        <Textarea 
                        {...field} 
                        placeholder="your instructions for the agent" />
                    </FormControl>
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
  );
};
