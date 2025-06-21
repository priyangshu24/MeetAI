import { createTRPCRouter } from "../init";

import { agentRouter } from "@/modules/agents/server/procedures";
import { meetingsRouter } from "@/modules/meetings/server/procedures";


export const appRouter =  createTRPCRouter({

    agent: agentRouter,
    meetings: meetingsRouter,
})
// export type defination of API
export type AppRouter = typeof appRouter;