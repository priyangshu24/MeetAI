import { StreamCallProvider } from "@/modules/meetings/ui/components/stream-call-provider";
import { CallPage } from "@/modules/meetings/ui/views/call-page";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";

interface Props {
  params: Promise<{ meetingId: string }>;
}

export default async function Page({ params }: Props) {
  const { meetingId } = await params;

  return (
    <Suspense fallback={<LoadingState title="Loading meeting" description="Preparing your call environment..." />}>
      <StreamCallProvider>
        <CallPage meetingId={meetingId} />
      </StreamCallProvider>
    </Suspense>
  );
}
