"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, UserProfile } from "@/lib/AuthContext";
import { getOrCreateConversation } from "@/lib/firestore";

interface UserProfileViewProps {
    user: UserProfile;
}

export function UserProfileView({ user }: UserProfileViewProps) {
    const router = useRouter();
    const { user: currentUser, userProfile: currentUserProfile } = useAuth();
    const [isStartingChat, setIsStartingChat] = useState(false);

    const isOwnProfile = currentUser?.uid === user.uid;

    const handleStartChat = async () => {
        if (!currentUser || !currentUserProfile) {
            router.push("/auth/login");
            return;
        }

        setIsStartingChat(true);
        try {
            const conversationId = await getOrCreateConversation(
                currentUser.uid,
                currentUserProfile.username,
                currentUserProfile.displayName,
                user.uid,
                user.username,
                user.displayName
            );
            router.push(`/messages/${conversationId}`);
        } catch (error) {
            console.error("Error starting chat:", error);
        } finally {
            setIsStartingChat(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 rounded-full"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-12 w-12 text-primary" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl font-bold">{user.displayName}</h1>
                            <p className="text-muted-foreground">@{user.username}</p>

                            <div className="flex items-center justify-center sm:justify-start mt-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>

                            {user.bio && (
                                <p className="mt-4 text-sm">{user.bio}</p>
                            )}

                            {/* Actions */}
                            <div className="mt-6 flex flex-wrap gap-2 justify-center sm:justify-start">
                                {!isOwnProfile && (
                                    <Button
                                        onClick={handleStartChat}
                                        disabled={isStartingChat}
                                    >
                                        {isStartingChat ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Starting chat...
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                )}

                                {isOwnProfile && (
                                    <Link href="/messages">
                                        <Button variant="outline">
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            My Messages
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
