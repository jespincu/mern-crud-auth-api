import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string({
        required_error: "Title must not be empty",
    }).min(1).max(100),
    description: z.string({
        required_error: "Description must not be empty",
    }).min(1).max(2000),
    date: z.string().datetime().optional(),
    completed: z.boolean().optional(),
});