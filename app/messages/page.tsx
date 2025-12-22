"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToConversations, Conversation } from "@/lib/firestore";

export default function MessagesPage() {
    const router = useRouter();
    const { user, userProfile, loading } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/auth/login");
            return;
        }

        const unsubscribe = subscribeToConversations(user.uid, (convs) => {
            setConversations(convs);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, loading, router]);

    if (loading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!user || !userProfile) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    <MessageCircle className="h-6 w-6 mr-2 text-primary" />
                    Messages
                </h1>

                {conversations.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">No conversations yet</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Start a conversation by visiting a user&apos;s profile and clicking &quot;Send Message&quot;
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((conversation) => {
                            // Get the other participant's info
                            const otherIndex = conversation.participants.indexOf(user.uid) === 0 ? 1 : 0;
                            const otherUsername = conversation.participantUsernames[otherIndex];
                            const otherDisplayName = conversation.participantDisplayNames[otherIndex];

                            return (
                                <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                                        <CardContent className="py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium truncate">
                                                            {otherDisplayName}
                                                            <span className="text-muted-foreground font-normal ml-1">
                                                                @{otherUsername}
                                                            </span>
                                                        </p>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(conversation.lastMessageAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {conversation.lastMessage && (
                                                        <p className="text-sm text-muted-foreground truncate mt-1">
                                                            {conversation.lastMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
