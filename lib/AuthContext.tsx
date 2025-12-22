"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    query,
    collection,
    where,
    getDocs,
} from 'firebase/firestore';
import { auth, db } from './firebase';

// User profile interface
export interface UserProfile {
    uid: string;
    email: string;
    username: string;
    displayName: string;
    photoURL?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    checkUsernameAvailable: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from Firestore
    const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return {
                    uid: data.uid,
                    email: data.email,
                    username: data.username,
                    displayName: data.displayName,
                    photoURL: data.photoURL,
                    bio: data.bio,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const profile = await fetchUserProfile(user.uid);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Check if username is available
    const checkUsernameAvailable = async (username: string): Promise<boolean> => {
        const normalizedUsername = username.toLowerCase().trim();
        const q = query(
            collection(db, 'users'),
            where('username', '==', normalizedUsername)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty;
    };

    // Create user profile in Firestore
    const createUserProfile = async (
        uid: string,
        email: string,
        username: string,
        displayName: string,
        photoURL?: string
    ) => {
        const normalizedUsername = username.toLowerCase().trim();
        const userRef = doc(db, 'users', uid);

        await setDoc(userRef, {
            uid,
            email,
            username: normalizedUsername,
            displayName,
            photoURL: photoURL || null,
            bio: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return fetchUserProfile(uid);
    };

    // Sign in with email/password
    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Sign up with email/password
    const signUp = async (
        email: string,
        password: string,
        username: string,
        displayName: string
    ) => {
        // Check username availability first
        const isAvailable = await checkUsernameAvailable(username);
        if (!isAvailable) {
            throw new Error('Username is already taken');
        }

        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name in Firebase Auth
        await updateProfile(userCredential.user, { displayName });

        // Create user profile in Firestore
        const profile = await createUserProfile(
            userCredential.user.uid,
            email,
            username,
            displayName
        );
        setUserProfile(profile);
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if user profile exists
        const existingProfile = await fetchUserProfile(result.user.uid);

        if (!existingProfile) {
            // Generate username from email
            const emailPrefix = result.user.email?.split('@')[0] || 'user';
            let username = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '');

            // Ensure username is unique
            let isAvailable = await checkUsernameAvailable(username);
            let counter = 1;
            while (!isAvailable) {
                username = `${emailPrefix}${counter}`;
                isAvailable = await checkUsernameAvailable(username);
                counter++;
            }

            // Create profile
            const profile = await createUserProfile(
                result.user.uid,
                result.user.email || '',
                username,
                result.user.displayName || 'User',
                result.user.photoURL || undefined
            );
            setUserProfile(profile);
        } else {
            setUserProfile(existingProfile);
        }
    };

    // Sign out
    const signOut = async () => {
        await firebaseSignOut(auth);
        setUserProfile(null);
    };

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        checkUsernameAvailable,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
