import { z } from "zod";

export const agentsInertSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}).max(50, {message: "Name is too long"}),
    description: z.string().min(1, {message: "Description is required"}).max(500, {message: "Description is too long"}),
    instructions: z.string().min(1, {message: "Instructions are required"}),
    model: z.string().min(1, {message: "Model selection is required"}),
    capabilityVoice: z.boolean(),
    capabilityChat: z.boolean(),
    capabilityVision: z.boolean(),
    temperature: z.number().min(0).max(1),
});

export const agentsUpdateSchema = agentsInertSchema.extend({
    id: z.string().min(1, {message: "ID is required"}),
})