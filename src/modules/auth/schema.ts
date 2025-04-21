import z from "zod";

export const LoginPasswordSchema = z.string().min(1, { message: "No password provided" });
export const RegisterPasswordSchema = z.string().min(8, { message: "Password must be at least 8 characters long" });
export const EmailSchema = z.string().email({ message: "Invalid email address" });

// This will be a domain, in the form of [username].domain.com
// It must be between 3 and 63 characters long
// It may contain dashes, but must start and end with a letter or number
// It must not have consecutive dashes
// It will always be lowercased
export const UsernameSchema = z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(63, { message: "Username must be at most 63 characters long" })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, {
        message: "Username must start and end with a letter or number and may contain dashes",
    })
    .refine((value) => !value.includes("--"), { message: "Username must not contain consecutive dashes" })
    .transform((value) => value.toLowerCase());

export const RegisterSchema = z.object({
    email: EmailSchema,
    password: RegisterPasswordSchema,
    username: UsernameSchema,
});

// Just email and password without length restrictions
export const LoginSchema = z.object({
    email: EmailSchema,
    password: LoginPasswordSchema,
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
