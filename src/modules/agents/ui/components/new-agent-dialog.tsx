import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const NewAgentDialog = ({
    open,
    onOpenChange,
}: NewAgentDialogProps) => {
    const [createdAgent, setCreatedAgent] = useState<any>(null);

    const handleSuccess = (data: any) => {
        setCreatedAgent(data);
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after a delay to avoid flicker during closing animation
        setTimeout(() => setCreatedAgent(null), 300);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <ResponsiveDialog
            title={createdAgent ? "Agent Created!" : "New Agent"}
            description={createdAgent ? "Your new AI agent is ready to use" : "Create a new agent"}
            open={open}
            onOpenChange={handleClose}
        > 
            {createdAgent ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-6">
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="size-10 text-primary animate-in zoom-in duration-300" />
                    </div>
                    
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold">{createdAgent.name}</h3>
                        <p className="text-sm text-muted-foreground px-6">
                            Successfully created and initialized with {createdAgent.model}.
                        </p>
                    </div>

                    <div className="w-full space-y-3 pt-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
                            <div className="flex-1 truncate text-xs font-mono text-muted-foreground">
                                ID: {createdAgent.id}
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8"
                                onClick={() => copyToClipboard(createdAgent.id)}
                            >
                                <Copy className="size-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={handleClose} className="w-full">
                                Close
                            </Button>
                            <Button asChild className="w-full">
                                <a href={`/agents/${createdAgent.id}`}>
                                    View Agent <ExternalLink className="ml-2 size-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <AgentForm
                    onSuccess={handleSuccess}
                    onCancel={handleClose} 
                />
            )}
        </ResponsiveDialog>
    )
}