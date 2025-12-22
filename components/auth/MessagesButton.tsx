"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export function MessagesButton() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    // Function to check unread count
    const checkUnreadCount = useCallback(async () => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        try {
            // Get all conversations for this user
            const conversationsQuery = query(
                collection(db, "conversations"),
                where("participants", "array-contains", user.uid)
            );

            const conversationsSnapshot = await getDocs(conversationsQuery);
            let totalUnread = 0;

            // Check each conversation for unread messages
            for (const convDoc of conversationsSnapshot.docs) {
                const messagesQuery = query(
                    collection(db, "conversations", convDoc.id, "messages"),
                    where("read", "==", false)
                );

                const messagesSnapshot = await getDocs(messagesQuery);

                // Count messages not from current user
                const unreadFromOthers = messagesSnapshot.docs.filter(
                    (msg) => msg.data().senderId !== user.uid
                ).length;

                totalUnread += unreadFromOthers;
            }

            setUnreadCount(totalUnread);
        } catch (error) {
            console.error("Error checking unread count:", error);
        }
    }, [user]);

    // Check on mount and periodically
    useEffect(() => {
        if (!user) return;

        // Initial check
        checkUnreadCount();

        // Check every 10 seconds for new messages
        const interval = setInterval(checkUnreadCount, 10000);

        // Also check when window gains focus
        const handleFocus = () => checkUnreadCount();
        window.addEventListener("focus", handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
        };
    }, [user, checkUnreadCount]);

    if (!user) {
        return null;
    }

    return (
        <Link href="/messages">
            <Button variant="ghost" size="icon" className="relative">
                <MessageCircle className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </Button>
        </Link>
    );
}
