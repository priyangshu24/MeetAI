import { z } from "zod";

export const agentsInertSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    instructions: z.string().min(1, {message: "Instructions are required"}),
});

export const agentsUpdateSchema = z.object({
    id: z.string().min(1, {message: "ID is required"}),
    name: z.string().min(1, {message: "Name is required"}),
    instructions: z.string().min(1, {message: "Instructions are required"}),
})