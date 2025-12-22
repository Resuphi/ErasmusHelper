import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from './AuthContext';

// ============ USER FUNCTIONS ============

// Search users by username (prefix search)
export async function searchUsersByUsername(
    searchTerm: string,
    maxResults: number = 10
): Promise<UserProfile[]> {
    // Remove @ symbol if present and normalize
    const normalizedSearch = searchTerm.toLowerCase().trim().replace(/^@/, '');

    if (!normalizedSearch) return [];

    // Firestore doesn't support native "contains" search
    // We use range query for prefix matching
    const q = query(
        collection(db, 'users'),
        where('username', '>=', normalizedSearch),
        where('username', '<=', normalizedSearch + '\uf8ff'),
        limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => docToUserProfile(doc));
}

// Get user by username
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
    const normalizedUsername = username.toLowerCase().trim();

    const q = query(
        collection(db, 'users'),
        where('username', '==', normalizedUsername),
        limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return docToUserProfile(snapshot.docs[0]);
}

// Get user by UID
export async function getUserByUid(uid: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) return null;

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

// Helper to convert Firestore doc to UserProfile
function docToUserProfile(doc: QueryDocumentSnapshot): UserProfile {
    const data = doc.data();
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

// ============ CONVERSATION FUNCTIONS ============

export interface Conversation {
    id: string;
    participants: string[];
    participantUsernames: string[];
    participantDisplayNames: string[];
    lastMessage: string;
    lastMessageAt: Date;
    createdAt: Date;
}

export interface Message {
    id: string;
    senderId: string;
    senderUsername: string;
    content: string;
    createdAt: Date;
    read: boolean;
}

// Get or create a conversation between two users
export async function getOrCreateConversation(
    currentUserId: string,
    currentUsername: string,
    currentDisplayName: string,
    otherUserId: string,
    otherUsername: string,
    otherDisplayName: string
): Promise<string> {
    // Check if conversation already exists
    const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUserId)
    );

    const snapshot = await getDocs(q);

    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.participants.includes(otherUserId)) {
            return doc.id;
        }
    }

    // Create new conversation
    const newConversation = await addDoc(collection(db, 'conversations'), {
        participants: [currentUserId, otherUserId],
        participantUsernames: [currentUsername, otherUsername],
        participantDisplayNames: [currentDisplayName, otherDisplayName],
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
    });

    return newConversation.id;
}

// Get all conversations for a user
export function subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
) {
    const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const conversations: Conversation[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                participants: data.participants,
                participantUsernames: data.participantUsernames,
                participantDisplayNames: data.participantDisplayNames,
                lastMessage: data.lastMessage,
                lastMessageAt: data.lastMessageAt?.toDate() || new Date(),
                createdAt: data.createdAt?.toDate() || new Date(),
            };
        });
        callback(conversations);
    });
}

// Subscribe to messages in a conversation
export function subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
) {
    const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages: Message[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                senderId: data.senderId,
                senderUsername: data.senderUsername,
                content: data.content,
                createdAt: data.createdAt?.toDate() || new Date(),
                read: data.read,
            };
        });
        callback(messages);
    });
}

// Send a message
export async function sendMessage(
    conversationId: string,
    senderId: string,
    senderUsername: string,
    content: string
): Promise<void> {
    // Add message to subcollection
    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        senderId,
        senderUsername,
        content,
        createdAt: serverTimestamp(),
        read: false,
    });

    // Update conversation's last message
    await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: content.substring(0, 100),
        lastMessageAt: serverTimestamp(),
    });
}

// Mark messages as read
export async function markMessagesAsRead(
    conversationId: string,
    currentUserId: string
): Promise<void> {
    // Get all unread messages first, then filter in code
    const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        where('read', '==', false)
    );

    const snapshot = await getDocs(q);

    // Filter to only messages NOT from current user (messages from others)
    const unreadFromOthers = snapshot.docs.filter(
        (msgDoc) => msgDoc.data().senderId !== currentUserId
    );

    const updatePromises = unreadFromOthers.map((msgDoc) =>
        updateDoc(doc(db, 'conversations', conversationId, 'messages', msgDoc.id), {
            read: true,
        })
    );

    await Promise.all(updatePromises);
}

// ============ COMMENT FUNCTIONS ============

export interface Comment {
    id: string;
    universityId: string;
    userId: string;
    username: string;
    displayName: string;
    content: string;
    createdAt: Date;
}

// Create a new comment
export async function createComment(
    universityId: string,
    userId: string,
    username: string,
    displayName: string,
    content: string
): Promise<Comment> {
    const commentRef = await addDoc(collection(db, 'comments'), {
        universityId,
        userId,
        username,
        displayName,
        content,
        createdAt: serverTimestamp(),
    });

    return {
        id: commentRef.id,
        universityId,
        userId,
        username,
        displayName,
        content,
        createdAt: new Date(),
    };
}

// Get comments for a university
export async function getCommentsByUniversity(universityId: string): Promise<Comment[]> {
    const q = query(
        collection(db, 'comments'),
        where('universityId', '==', universityId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            universityId: data.universityId,
            userId: data.userId,
            username: data.username,
            displayName: data.displayName,
            content: data.content,
            createdAt: data.createdAt?.toDate() || new Date(),
        };
    });
}
