"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getUserByUsername } from "@/lib/firestore";
import { UserProfileView } from "@/components/user/UserProfileView";
import { UserProfile } from "@/lib/AuthContext";

interface UserProfilePageProps {
    params: {
        username: string;
    };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                const userData = await getUserByUsername(params.username);
                if (!userData) {
                    setNotFound(true);
                } else {
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error loading user:", error);
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [params.username]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (notFound || !user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto text-center space-y-4">
                    <h1 className="text-2xl font-bold">User Not Found</h1>
                    <p className="text-muted-foreground">
                        The user @{params.username} doesn&apos;t exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <UserProfileView user={user} />
        </div>
    );
}
