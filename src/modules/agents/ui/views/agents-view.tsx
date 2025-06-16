"use client";

import {  useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns} from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agent.getMany.queryOptions());
    
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex-col gap-y-4">
            <DataTable data={data} columns={columns}/> 
            {data.length === 0 && (
                <EmptyState
                    title="Create your first agent"
                    description="Agents are the building blocks of your AI. Create your first agent to get started."
                
                />
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState
        title="Loading Agents"
        description="This may take a few seconds"
        />
    );
};

export const AgentsViewError = () => {
    return(
    <ErrorState 
            title="Loading Agent Error" 
            description="Please try again later"
    />
    )   
}