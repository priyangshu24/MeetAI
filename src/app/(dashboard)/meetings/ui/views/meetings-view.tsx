"use client";

import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataPagination } from "@/modules/agents/ui/components/data-pagination";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { columns } from "@/modules/meetings/ui/components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const MeetingsView = () => {
    
    const trpc = useTRPC();
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilters();
    const { data } = useSuspenseQuery(trpc.meeting.getMany.queryOptions({
        ...filters,  
    }))


    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable 
            data={data.items} 
            columns={columns} 
            onRowClick={(row) => router.push(`/meetings/${row.id}`)}/>
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({
                    page,
                })}
            />
              {data.items.length === 0 && (
                <EmptyState
                    title="No Meetings Found"
                    description="You can create a new meeting by clicking the button below."
                />
              )}
        </div>
        
    );
};
export const MeetingsViewLoading = () => {
    return (
        <LoadingState
        title="Loading Meetings"
        description="This may take a few seconds"
        />
    );
};

export const MeetingsViewError = () => {
    return(
    <ErrorState 
            title="Loading Meetings Error" 
            description="Please try again later"
    />
    )   
}