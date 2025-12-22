"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, MessageCircle, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export function UserMenu() {
    const router = useRouter();
    const { user, userProfile, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user || !userProfile) {
        return (
            <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                        Sign In
                    </Button>
                </Link>
                <Link href="/auth/register">
                    <Button size="sm">
                        Sign Up
                    </Button>
                </Link>
            </div>
        );
    }

    const handleSignOut = async () => {
        await signOut();
        setIsOpen(false);
        router.push("/");
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {userProfile.photoURL ? (
                    <Image
                        src={userProfile.photoURL}
                        alt={userProfile.displayName}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full"
                    />
                ) : (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                )}
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                    {userProfile.displayName}
                </span>
                <ChevronDown className="h-4 w-4" />
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border z-50">
                        <div className="px-4 py-3 border-b">
                            <p className="text-sm font-medium truncate">{userProfile.displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">@{userProfile.username}</p>
                        </div>

                        <div className="py-1">
                            <Link
                                href={`/user/${userProfile.username}`}
                                className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="mr-3 h-4 w-4" />
                                Profile
                            </Link>

                            <Link
                                href="/messages"
                                className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <MessageCircle className="mr-3 h-4 w-4" />
                                Messages
                            </Link>
                        </div>

                        <div className="border-t py-1">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-accent transition-colors"
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
