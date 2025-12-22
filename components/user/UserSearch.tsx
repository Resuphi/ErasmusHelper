"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchUsersByUsername } from "@/lib/firestore";
import { UserProfile } from "@/lib/AuthContext";

export function UserSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search with debounce
    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const users = await searchUsersByUsername(trimmedQuery);
                setResults(users);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-xs">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-10 h-9"
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {results.map((user) => (
                        <Link
                            key={user.uid}
                            href={`/user/${user.username}`}
                            className="flex items-center px-4 py-2 hover:bg-accent transition-colors"
                            onClick={handleSelect}
                        >
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full mr-3"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium">{user.displayName}</p>
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
                    No users found
                </div>
            )}
        </div>
    );
}
