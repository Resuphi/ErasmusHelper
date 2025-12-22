"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToMessages, sendMessage, markMessagesAsRead, Message, Conversation } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ChatPageProps {
    params: {
        conversationId: string;
    };
}

export default function ChatPage({ params }: ChatPageProps) {
    const router = useRouter();
    const { user, userProfile, loading } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversation details
    useEffect(() => {
        async function fetchConversation() {
            try {
                const convDoc = await getDoc(doc(db, "conversations", params.conversationId));
                if (convDoc.exists()) {
                    const data = convDoc.data();
                    setConversation({
                        id: convDoc.id,
                        participants: data.participants,
                        participantUsernames: data.participantUsernames,
                        participantDisplayNames: data.participantDisplayNames,
                        lastMessage: data.lastMessage,
                        lastMessageAt: data.lastMessageAt?.toDate() || new Date(),
                        createdAt: data.createdAt?.toDate() || new Date(),
                    });
                }
            } catch (error) {
                console.error("Error fetching conversation:", error);
            }
        }

        fetchConversation();
    }, [params.conversationId]);

    // Subscribe to messages and mark as read
    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/auth/login");
            return;
        }

        const unsubscribe = subscribeToMessages(params.conversationId, (msgs) => {
            setMessages(msgs);
            setIsLoading(false);

            // Mark messages as read when viewing the conversation
            markMessagesAsRead(params.conversationId, user.uid).catch((err) => {
                console.error("Error marking messages as read:", err);
            });
        });

        return () => unsubscribe();
    }, [user, loading, router, params.conversationId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !userProfile || !newMessage.trim()) return;

        setIsSending(true);
        try {
            await sendMessage(
                params.conversationId,
                user.uid,
                userProfile.username,
                newMessage.trim()
            );
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

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

    // Get the other participant's info
    const otherIndex = conversation?.participants.indexOf(user.uid) === 0 ? 1 : 0;
    const otherUsername = conversation?.participantUsernames[otherIndex] || "User";
    const otherDisplayName = conversation?.participantDisplayNames[otherIndex] || "User";

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
                {/* Header */}
                <div className="flex items-center gap-4 pb-4 border-b">
                    <Link href="/messages">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href={`/user/${otherUsername}`} className="flex items-center gap-3 hover:opacity-80">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{otherDisplayName}</p>
                            <p className="text-sm text-muted-foreground">@{otherUsername}</p>
                        </div>
                    </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwn = message.senderId === user.uid;
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwn
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        <p
                                            className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                                                }`}
                                        >
                                            {new Date(message.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isSending}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isSending || !newMessage.trim()}>
                        {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
