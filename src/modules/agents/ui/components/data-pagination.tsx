import { Button } from "@/components/ui/button";


interface Props {
    page: number;
    totalPages: number;
    onPageChange : (page: number) => void;
}

export const DataPagination = ({
    page,
    totalPages,
    onPageChange,
}: Props)=>{
    return(
        <div className="flex flex-col sm:flex-row items-center justify-between gap-y-2">
            <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1} 
                  onClick={()=> onPageChange(Math.max(1, page - 1))}
                >
                  Previous
                </Button>
                <Button
                  disabled={page === totalPages || totalPages ===0} 
                  variant="outline"
                  size="sm"
                  onClick={()=> onPageChange(Math.min(totalPages, page + 1))}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};