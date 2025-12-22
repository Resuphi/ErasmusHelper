"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, Send, Loader2, LogIn } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment } from "@/lib/firestore";
import { useAuth } from "@/lib/AuthContext";

interface CommentFormProps {
  universityId: string;
  universityName: string;
}

export function CommentForm({ universityId, universityName }: CommentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { user, userProfile, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user || !userProfile) return;
    if (content.trim().length < 10) {
      setMessage({ type: "error", text: "Comment must be at least 10 characters" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await createComment(
        universityId,
        user.uid,
        userProfile.username,
        userProfile.displayName,
        content.trim()
      );

      setMessage({
        type: "success",
        text: "Thank you for sharing your experience!",
      });
      setContent("");
      // Refresh the page to show the new comment
      router.refresh();
    } catch (error) {
      console.error("Error creating comment:", error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user || !userProfile) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Share Your Experience</h3>
        </div>

        <div className="text-center py-8">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Sign in to share your Erasmus experience at {universityName}
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in form
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Share Your Experience</h3>
      </div>

      <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
          {userProfile.displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{userProfile.displayName}</p>
          <p className="text-sm text-muted-foreground">@{userProfile.username}</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            id="content"
            name="content"
            placeholder="Share your Erasmus experience, tips, or advice for future students..."
            rows={5}
            required
            disabled={isSubmitting}
            minLength={10}
            maxLength={1000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Minimum 10 characters, maximum 1000 characters
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
              }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Comment
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
