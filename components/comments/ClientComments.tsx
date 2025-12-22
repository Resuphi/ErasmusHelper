"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getCommentsByUniversity, Comment } from "@/lib/firestore";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface ClientCommentsProps {
    universityId: string;
    universityName: string;
}

export function ClientComments({ universityId, universityName }: ClientCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadComments() {
            try {
                const fetchedComments = await getCommentsByUniversity(universityId);
                setComments(fetchedComments);
            } catch (error) {
                console.error("Error loading comments:", error);
            } finally {
                setLoading(false);
            }
        }

        loadComments();
    }, [universityId]);

    const refreshComments = async () => {
        const fetchedComments = await getCommentsByUniversity(universityId);
        setComments(fetchedComments);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CommentForm
                universityId={universityId}
                universityName={universityName}
            />
            <CommentList comments={comments} />
        </div>
    );
}
