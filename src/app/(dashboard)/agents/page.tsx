import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { 
    AgentsView,
    AgentsViewLoading,
    AgentsViewError 
} from "@/modules/agents/ui/views/agents-view";
import { AgensListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { auth } from "@/lib/auth";



const Page = async () => {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session){
      redirect("/sign-in");
    }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agent.getMany.queryOptions());
  return (
    <>
     <AgensListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading/>}>
        <ErrorBoundary fallback={<AgentsViewError/>}>
            <AgentsView />
        </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
    </>
  );
};

export default Page;
