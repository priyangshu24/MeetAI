import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { MeetingForm } from "./meeting-form";


interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const NewMeetingDialog = ({
    open,
    onOpenChange,
}: NewMeetingDialogProps) => {
    const router = useRouter();
    const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);

    const handleSuccess = (id?: string) => {
        if (id) {
            setCreatedMeetingId(id);
        } else {
            onOpenChange(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after a delay to avoid flicker during closing animation
        setTimeout(() => setCreatedMeetingId(null), 300);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <ResponsiveDialog
            title={createdMeetingId ? "Meeting Created!" : "New Meeting"}
            description={createdMeetingId ? "Your new meeting has been scheduled" : "Create a new Meeting"}
            open={open}
            onOpenChange={handleClose}
        > 
            {createdMeetingId ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-6">
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="size-10 text-primary animate-in zoom-in duration-300" />
                    </div>
                    
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold">Success!</h3>
                        <p className="text-sm text-muted-foreground px-6">
                            Your meeting has been created successfully.
                        </p>
                    </div>

                    <div className="w-full space-y-3 pt-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
                            <div className="flex-1 truncate text-xs font-mono text-muted-foreground">
                                ID: {createdMeetingId}
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8"
                                onClick={() => copyToClipboard(createdMeetingId)}
                            >
                                <Copy className="size-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={handleClose} className="w-full">
                                Close
                            </Button>
                            <Button asChild className="w-full">
                                <a href={`/meetings/${createdMeetingId}`}>
                                    Go to Meeting <ExternalLink className="ml-2 size-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <MeetingForm
                    onSuccess={handleSuccess}
                    onCancel={handleClose}
                />
            )}
        </ResponsiveDialog>
    )
}