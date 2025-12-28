"use client";

import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { VideoIcon, XIcon, PlayIcon, FileTextIcon, Trash2Icon, ChevronRightIcon, Edit2Icon, CheckCircle2Icon, Loader2Icon, CheckCircleIcon, LogOutIcon, SquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { MeetingForm } from "../components/meeting-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

interface Props {
    meetingsId: string;
};

export const MeetingsIdView = ({ meetingsId }: Props)=> {
    const router = useRouter();
    const trpc = useTRPC();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const { data: meeting } = useSuspenseQuery(
        trpc.meeting.getOne.queryOptions({ id: meetingsId })
    );

    const updateMutation = useMutation(
        trpc.meeting.update.mutationOptions({
            onSuccess: (data) => {
                const message = data.status === "cancelled" ? "Meeting cancelled" : "Meeting activated";
                toast.success(message);
                router.refresh();
            },
            onError: () => {
                toast.error("Failed to update meeting");
            }
        })
    );

    const removeMutation = useMutation(
        trpc.meeting.remove.mutationOptions({
            onSuccess: () => {
                toast.success("Meeting deleted");
                router.push("/meetings");
            },
            onError: () => {
                toast.error("Failed to delete meeting");
            }
        })
    );

    const handleUpdateStatus = (status: "upcoming" | "cancelled" | "completed") => {
        updateMutation.mutate({
            id: meetingsId,
            status
        });
    };

    const handleDelete = () => {
        removeMutation.mutate({ id: meetingsId });
    };

    return (
        <div className="flex-1 py-6 px-4 md:px-8 flex flex-col gap-y-6 max-w-5xl mx-auto w-full">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2 text-sm">
                    <button 
                        onClick={() => router.push("/meetings")}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        My Meetings
                    </button>
                    <ChevronRightIcon className="size-4 text-muted-foreground/50" />
                    <span className="font-semibold text-foreground">{meeting.name}</span>
                </div>

                <div className="flex items-center gap-x-2">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-x-2">
                                <Edit2Icon className="size-4" />
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden glass-card border-none">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle className="text-2xl font-bold">Edit Meeting</DialogTitle>
                            </DialogHeader>
                            <div className="p-6">
                                <MeetingForm 
                                    initialValues={meeting} 
                                    onSuccess={() => {
                                        setIsEditOpen(false);
                                        setIsSuccessOpen(true);
                                    }}
                                    onCancel={() => setIsEditOpen(false)}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-x-2">
                            <Trash2Icon className="size-4" />
                            Delete
                        </Button>
                    </AlertDialogTrigger>
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
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
            </div>

            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-[400px] text-center glass-card border-none">
                    <DialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center ring-4 ring-primary/10">
                                <CheckCircle2Icon className="size-8 text-primary" />
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center">Meeting Updated</DialogTitle>
                        <DialogDescription className="text-center text-lg pt-2">
                            The meeting agent and details have been successfully updated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center mt-6">
                        <Button 
                            onClick={() => setIsSuccessOpen(false)}
                            className="w-full sm:w-32 rounded-xl font-bold"
                        >
                            Awesome!
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="p-16 flex flex-col items-center justify-center text-center gap-y-8">
                    <div className="size-28 bg-primary/20 rounded-full flex items-center justify-center ring-8 ring-primary/10 backdrop-blur-sm">
                        {meeting.status === "upcoming" && <VideoIcon className="size-12 text-primary" />}
                        {meeting.status === "active" && <Loader2Icon className="size-12 text-primary animate-spin" />}
                        {meeting.status === "processing" && <Loader2Icon className="size-12 text-primary animate-pulse" />}
                        {meeting.status === "completed" && <CheckCircleIcon className="size-12 text-primary" />}
                        {meeting.status === "cancelled" && <XIcon className="size-12 text-primary" />}
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            {meeting.status === "upcoming" && "Ready to Start"}
                            {meeting.status === "active" && "Meeting in Progress"}
                            {meeting.status === "processing" && "Processing Meeting"}
                            {meeting.status === "completed" && "Meeting Completed"}
                            {meeting.status === "cancelled" && "Meeting Cancelled"}
                        </h2>
                        <p className="text-muted-foreground max-w-md text-lg">
                            {meeting.status === "upcoming" && "Your AI agent is ready. Start the meeting whenever you're prepared."}
                            {meeting.status === "active" && "The meeting is currently live. Your AI agent is listening and transcribing."}
                            {meeting.status === "processing" && "We're currently processing the recording and generating your summary."}
                            {meeting.status === "completed" && "This meeting has finished. You can view the transcript and summary below."}
                            {meeting.status === "cancelled" && "This meeting has been cancelled. You can still view details or delete it."}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full max-w-md">
                        {meeting.status === "upcoming" && (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    onClick={() => handleUpdateStatus("cancelled")}
                                    disabled={updateMutation.isPending}
                                    className="h-14 flex-1 rounded-2xl border-2 font-bold hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all gap-x-2"
                                >
                                    <XIcon className="size-5" />
                                    Cancel meeting
                                </Button>
                                <Button 
                                    size="lg"
                                    className="h-14 flex-1 rounded-2xl font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all gap-x-2"
                                >
                                    <PlayIcon className="size-5 fill-current" />
                                    Start meeting
                                </Button>
                            </>
                        )}
                        {meeting.status === "active" && (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    onClick={() => router.push("/meetings")}
                                    className="h-14 flex-1 rounded-2xl border-2 font-bold hover:bg-primary/10 transition-all gap-x-2"
                                >
                                    <LogOutIcon className="size-5" />
                                    Exit View
                                </Button>
                                <Button 
                                    size="lg"
                                    variant="destructive"
                                    onClick={() => handleUpdateStatus("completed")}
                                    disabled={updateMutation.isPending}
                                    className="h-14 flex-1 rounded-2xl font-bold shadow-2xl shadow-destructive/20 transition-all gap-x-2"
                                >
                                    <SquareIcon className="size-5 fill-current" />
                                    End Meeting
                                </Button>
                            </>
                        )}
                        {meeting.status === "processing" && (
                             <Button 
                                variant="outline" 
                                size="lg"
                                onClick={() => router.push("/meetings")}
                                className="h-14 w-full rounded-2xl border-2 font-bold hover:bg-primary/10 transition-all gap-x-2"
                            >
                                <LogOutIcon className="size-5" />
                                Exit to Dashboard
                            </Button>
                        )}
                        {meeting.status === "completed" && (
                             <Button 
                                variant="outline" 
                                size="lg"
                                onClick={() => router.push("/meetings")}
                                className="h-14 w-full rounded-2xl border-2 font-bold hover:bg-primary/10 transition-all gap-x-2"
                            >
                                <LogOutIcon className="size-5" />
                                Back to Meetings
                            </Button>
                        )}
                        {meeting.status === "cancelled" && (
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    onClick={() => handleUpdateStatus("upcoming")}
                                    disabled={updateMutation.isPending}
                                    className="h-14 flex-1 rounded-2xl border-2 font-bold hover:bg-primary/10 hover:text-primary hover:border-primary transition-all gap-x-2"
                                >
                                    <PlayIcon className="size-5" />
                                    Re-activate
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="lg"
                                    onClick={() => router.push("/meetings")}
                                    className="h-14 flex-1 rounded-2xl font-bold transition-all gap-x-2"
                                >
                                    <LogOutIcon className="size-5" />
                                    Exit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Placeholder for future sections like transcript/summary */}
            {meeting.status === "completed" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 glass-card rounded-2xl border-none space-y-4">
                        <div className="flex items-center gap-x-2 font-bold text-foreground">
                            <FileTextIcon className="size-5 text-primary" />
                            Summary
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {meeting.summary || "No summary available yet."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export const MeetingsIdViewLoading = () => {
    return (
      <LoadingState
        title="Loading Meeting"
        description="This may take a few seconds"
      />
    );
  };
  
  export const MeetingsIdViewError = () => {
    return (
      <ErrorState
        title="Loading Meeting Error"
        description="Please try again later"
      />
    );
  };