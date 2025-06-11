"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const HomeView = () => {
  const  trpc  = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "world" }));

  return (
    <div className="flex flex-col gap-y-4 p-4">
      {data?.greeting}
    </div>
  )
}