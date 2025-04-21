import { z } from "zod"


export const signUpSchema = z.object({
    name: z.string().min(2, { message: "name is short" }).max(10),
    email: z.string().email(),
    age: z.number().min(18),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),

}).superRefine((v, ctx) => {
    if (v.password !== v.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
        });
    }

})

export type CreateUserDto = z.infer<typeof signUpSchema>