import { z } from "zod";

export const registerSchema = z.object({
    username: z.string({
        required_error: "Username must not be empty",
    }).min(3).max(20),
    email: z.string({
        required_error: "Email is required",
    }).email({
        required_error: "Email must be a valid email address",
    }),
    password: z.string({
        required_error: "Password must not be empty",
    }).min(8, {
        message: "Password must be at least 8 characters long",
    }).max(20),
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
    }).email({
        required_error: "Email must be a valid email address",
    }),
    password: z.string({
        required_error: "Password must not be empty",
    }).min(8, {
        message: "Password must be at least 8 characters long",
    }).max(20),
});