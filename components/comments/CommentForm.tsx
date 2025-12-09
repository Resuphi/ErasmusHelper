"use client";

import { useRef, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createComment } from "@/app/actions/comments";

interface CommentFormProps {
  universityId: string;
  universityName: string;
}

export function CommentForm({ universityId, universityName }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await createComment(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
        });
        formRef.current?.reset();
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Share Your Experience</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Have you participated in an Erasmus program at {universityName}? Share your
        experience to help future students!
      </p>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <input type="hidden" name="universityId" value={universityId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">
              Surname <span className="text-destructive">*</span>
            </Label>
            <Input
              id="surname"
              name="surname"
              type="text"
              placeholder="Doe"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            Your email will not be displayed publicly
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">
            Comment <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Share your Erasmus experience, tips, or advice for future students..."
            rows={5}
            required
            disabled={isSubmitting}
            minLength={10}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground">
            Minimum 10 characters, maximum 1000 characters
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
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

