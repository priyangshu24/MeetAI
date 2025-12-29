import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { StreamClient } from "@stream-io/node-sdk";

import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { generateAvatarUrl } from "@/components/generated-avatar";

import { meetingsInertSchema, meetingsUpdateSchema } from "../schemas";

// CONSTANTS IMPORT
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { MeetingStatus } from "../types";

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        const apiSecret = process.env.STREAM_API_SECRET;

        if (!apiKey || !apiSecret || apiSecret === "your_secret_here") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Stream API Key or Secret is missing or invalid. Please set NEXT_PUBLIC_STREAM_API_KEY and STREAM_API_SECRET in .env",
          });
        }

        const client = new StreamClient(apiKey, apiSecret);
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const issuedAt = Math.floor(Date.now() / 1000) - 60;

        const token = client.generateUserToken({
          user_id: ctx.auth.user.id,
          exp: expirationTime,
          iat: issuedAt,
        });

        return { token };
      } catch (error) {
        console.error("Token generation error:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to generate token",
        });
      }
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removedMeeting] = await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.id, input.id), 
            eq(meetings.userId, ctx.auth.user.id)
          ),
        )
        .returning();
      if (!removedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }
      return removedMeeting;
    }),

  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(
            eq(meetings.id, input.id), 
            eq(meetings.userId, ctx.auth.user.id)
          ),
        )
        .returning();
      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }
      return updatedMeeting;
    }),

  create: protectedProcedure
  .input(meetingsInertSchema)
  .mutation(async ({ input, ctx }) => {
    const [createdMeeting] = await db
      .insert(meetings)
      .values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning();

    if (!createdMeeting) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create meeting",
      });
    }

    // Stream Call Creation
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (apiKey && apiSecret) {
      const client = new StreamClient(apiKey, apiSecret);
      
      // Upsert Stream User
      await client.upsertUsers([
        {
          id: ctx.auth.user.id,
          name: ctx.auth.user.name ?? ctx.auth.user.email,
          image: ctx.auth.user.image ?? generateAvatarUrl(ctx.auth.user.name ?? ctx.auth.user.email),
        }
      ]);

      const call = client.video.call("default", createdMeeting.id);
      await call.getOrCreate({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            name: createdMeeting.name,
          }
        }
      });
    }

    return createdMeeting;
  }),


  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql`
            EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt})) / 60
          `,
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)  
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId : z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Cancelled,
            MeetingStatus.Processing, 
          ])
          .nullish(),
      })
    )

    .query(async ({ ctx, input }) => {
      const { search, page, pageSize, agentId, status } = input;
      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql`
            EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt})) / 60
          `,
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
            status ? eq(meetings.status, status) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
            status ? eq(meetings.status, status) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});
