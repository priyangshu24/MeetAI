import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { 
     MeetingsIdView,
     MeetingsIdViewError,
     MeetingsIdViewLoading
     } from "@/modules/meetings/ui/views/meeting-id-view";

interface Props {
    params: Promise<{ meetingId: string }>
}

const Page = async ({ params }: Props) => {
    const { meetingId } = await params

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meeting.getOne.queryOptions({ id: meetingId }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsIdViewLoading/>}> 
               <ErrorBoundary fallback={<MeetingsIdViewError/>}>
                  <MeetingsIdView meetingsId={meetingId} />
               </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;