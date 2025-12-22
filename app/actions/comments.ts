"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations/comment";

export async function createComment(formData: FormData) {
  try {
    // Extract data from FormData
    const data = {
      universityId: formData.get("universityId") as string,
      userId: formData.get("userId") as string,
      username: formData.get("username") as string,
      displayName: formData.get("displayName") as string,
      content: formData.get("content") as string,
    };

    // Validate with Zod
    const validatedData = commentSchema.parse(data);

    // Save to database
    const comment = await prisma.comment.create({
      data: validatedData,
    });

    // Revalidate the university page to show new comment
    revalidatePath(`/university/${validatedData.universityId}`);

    return {
      success: true,
      message: "Comment submitted successfully!",
      comment,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to submit comment. Please try again.",
    };
  }
}

export async function getCommentsByUniversity(universityId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        universityId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}


