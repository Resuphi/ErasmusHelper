import { z } from "zod";

export const commentSchema = z.object({
  universityId: z.string().min(1, "University ID is required"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Name can only contain letters"),
  surname: z
    .string()
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname must be less than 50 characters")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Surname can only contain letters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  content: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be less than 1000 characters"),
});

export type CommentFormData = z.infer<typeof commentSchema>;

