"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, AtSign, Loader2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";

export function RegisterForm() {
    const router = useRouter();
    const { signUp, signInWithGoogle, checkUsernameAvailable } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check username availability with debounce
    useEffect(() => {
        const normalizedUsername = username.toLowerCase().trim();

        if (normalizedUsername.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        // Validate username format
        if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
            setUsernameAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsCheckingUsername(true);
            try {
                const available = await checkUsernameAvailable(normalizedUsername);
                setUsernameAvailable(available);
            } catch (err) {
                console.error("Error checking username:", err);
            } finally {
                setIsCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, checkUsernameAvailable]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        const normalizedUsername = username.toLowerCase().trim();
        if (normalizedUsername.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
            setError("Username can only contain letters, numbers, and underscores");
            return;
        }

        if (!usernameAvailable) {
            setError("Username is not available");
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password, normalizedUsername, displayName);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setIsGoogleLoading(true);

        try {
            await signInWithGoogle();
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Join the Erasmus Helper community</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 rounded-md bg-red-50 text-red-800 border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="displayName"
                                type="text"
                                placeholder="John Doe"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="pl-10"
                                required
                                disabled={isLoading || isGoogleLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                type="text"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                className="pl-10 pr-10"
                                required
                                disabled={isLoading || isGoogleLoading}
                            />
                            {username.length >= 3 && (
                                <div className="absolute right-3 top-3">
                                    {isCheckingUsername ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    ) : usernameAvailable === true ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : usernameAvailable === false ? (
                                        <X className="h-4 w-4 text-red-600" />
                                    ) : null}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Letters, numbers, and underscores only. At least 3 characters.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                                disabled={isLoading || isGoogleLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                                minLength={6}
                                disabled={isLoading || isGoogleLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10"
                                required
                                disabled={isLoading || isGoogleLoading}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || isGoogleLoading || usernameAvailable === false}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                >
                    {isGoogleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Continue with Google
                </Button>
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
