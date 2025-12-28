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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Loader2 } from "lucide-react";

interface AgentFormProps {
  onSuccess?: (data: AgentGetOne) => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

type AgentFormData = z.infer<typeof agentsInertSchema>;

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agent.create.mutationOptions({
      onSuccess: async(data) => {
        await queryClient.invalidateQueries(
          trpc.agent.getMany.queryOptions({}),
        )
        toast.success("Agent created successfully")
        onSuccess?.(data)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  );

  const UpdateAgent = useMutation(
    trpc.agent.update.mutationOptions({
      onSuccess: async(data) => {
        await queryClient.invalidateQueries(
          trpc.agent.getMany.queryOptions({}),
        )

        if(initialValues?.id){
            await queryClient.invalidateQueries(
                trpc.agent.getOne.queryOptions({ id: initialValues.id }),
            )
        }
        toast.success("Agent updated successfully")
        onSuccess?.(data)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  );

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentsInertSchema),
    defaultValues: {
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
        instructions: initialValues?.instructions ??"",
        model: initialValues?.model ?? "gpt-4",
        capabilityVoice: initialValues?.capabilityVoice ?? false,
        capabilityChat: initialValues?.capabilityChat ?? true,
        capabilityVision: initialValues?.capabilityVision ?? false,
        temperature: initialValues?.temperature ?? 0.7,
    }
  });

  const isEdit = !! initialValues?.id;
  const isPending = createAgent.isPending || UpdateAgent.isPending;
  const isValid = form.formState.isValid;

  const onSubmit = (values: AgentFormData) => {
    if (isEdit) {
        UpdateAgent.mutate({ ...values, id: initialValues.id })
    } else {
        createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center gap-4">
                <GeneratedAvatar 
                    seed={form.watch("name")}
                    variant="botttsNetural"
                    className="border size-20 rounded-xl"
                />
                <div className="flex-1">
                    <FormField 
                    name="name"
                    control={form.control}
                    render= {({field})=>(
                            <FormItem>
                                <FormLabel>Agent Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. Research Assistant" className="h-11" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <FormField 
                name="description"
                control={form.control}
                render= {({field})=>(
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Short Description</FormLabel>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">
                                {field.value?.length || 0}/500
                            </span>
                        </div>
                        <FormControl>
                            <Textarea 
                                {...field} 
                                placeholder="Briefly describe what this agent does..." 
                                className="resize-none min-h-[80px]"
                            />
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
                        <FormLabel>System Instructions</FormLabel>
                        <FormControl>
                            <Textarea 
                                {...field} 
                                placeholder="Provide detailed behavioral instructions for the agent..." 
                                className="min-h-[120px]"
                            />
                        </FormControl>
                        <FormDescription>
                            Define how the agent should behave and respond.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    name="model"
                    control={form.control}
                    render= {({field})=>(
                        <FormItem>
                            <FormLabel>AI Model</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField 
                    name="temperature"
                    control={form.control}
                    render= {({field})=>(
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Temperature ({field.value})</FormLabel>
                            </div>
                            <FormControl>
                                <div className="pt-2">
                                    <Slider 
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={[field.value]}
                                        onValueChange={(vals) => field.onChange(vals[0])}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                Creative (1.0) vs Focused (0.0)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-muted/30">
                <FormField 
                    name="capabilityChat"
                    control={form.control}
                    render= {({field})=>(
                        <FormItem className="flex flex-col items-center gap-2">
                            <FormLabel className="text-xs">Chat</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField 
                    name="capabilityVoice"
                    control={form.control}
                    render= {({field})=>(
                        <FormItem className="flex flex-col items-center gap-2">
                            <FormLabel className="text-xs">Voice</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField 
                    name="capabilityVision"
                    control={form.control}
                    render= {({field})=>(
                        <FormItem className="flex flex-col items-center gap-2">
                            <FormLabel className="text-xs">Vision</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <Button
                        variant="outline"
                        disabled={isPending}
                        type="button"
                        onClick={() => onCancel()}
                        className="rounded-xl px-6"
                    >
                        Cancel
                    </Button>
                )}
                <Button 
                    disabled={isPending || !isValid} 
                    type="submit"
                    className="rounded-xl px-8 min-w-[120px]"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        isEdit ? "Update Agent" : "Create Agent"
                    )}
                </Button>
            </div>
        </form>
    </Form>    
  );
};
