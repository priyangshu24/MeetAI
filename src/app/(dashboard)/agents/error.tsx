"use client";

import { ErrorState } from "@/components/error-state";

const ErrorPage = () => {
    return (
        <ErrorState 
        title="Loading Agent Error" 
        description="Please try again later"
        />
    )
}
export default ErrorPage;