import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, interval } from 'rxjs';
import { take } from 'rxjs/operators';

export interface Message {
    user: string;
    text: string;
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // --- Simulating backend communication with RxJS Subjects ---
    private messagesSubject = new Subject<Message>();
    private messageHistorySubject = new Subject<Message[]>();
    private usersInRoomSubject = new BehaviorSubject<string[]>([]);

    // In-memory storage for messages and users (will reset on browser refresh)
    private allMessages: Message[] = [];
    private currentUsers = new Set<string>();

    constructor() {
        // Simulate some initial message history (optional)
        this.allMessages.push({
            user: 'Admin',
            text: 'Welcome to the discussion room!',
            timestamp: new Date().toISOString()
        });

        // Simulate other users joining/leaving over time (for dynamic user list)
        this.simulateUserActivity();
    }

    // --- Public methods for components to interact with ---

    joinRoom(username: string) {
        if (!this.currentUsers.has(username)) {
            this.currentUsers.add(username);
            this.usersInRoomSubject.next(Array.from(this.currentUsers)); // Update user list for all
            console.log(`[Dummy Backend] ${username} joined.`);

            // Send message history to the newly joined user
            this.messageHistorySubject.next(this.allMessages);

            // Notify all users about the new join
            this.messagesSubject.next({
                user: 'Admin',
                text: `${username} has joined the chat.`,
                timestamp: new Date().toISOString()
            });
        } else {
            // If user already exists, just send history
            this.messageHistorySubject.next(this.allMessages);
        }
    }

    sendMessage(messageText: string, username: string) {
        const newMessage: Message = {
            user: username,
            text: messageText,
            timestamp: new Date().toISOString()
        };
        this.allMessages.push(newMessage);
        console.log(`[Dummy Backend] Message from ${username}: ${messageText}`);
        this.messagesSubject.next(newMessage); // Emit to all subscribers
    }

    getMessages(): Observable<Message> {
        return this.messagesSubject.asObservable();
    }

    getMessageHistory(): Observable<Message[]> {
        return this.messageHistorySubject.asObservable();
    }

    getUsersInRoom(): Observable<string[]> {
        return this.usersInRoomSubject.asObservable();
    }

    // --- Internal simulation logic ---
    private simulateUserActivity() {
        const dummyUsers = ['Alice', 'Bob', 'Charlie', 'David'];
        let userIndex = 0;

        // Simulate users joining every 10-20 seconds
        interval(Math.random() * 10000 + 10000).subscribe(() => { // Between 10 and 20 seconds
            if (userIndex < dummyUsers.length) {
                const dummyUser = dummyUsers[userIndex++];
                if (!this.currentUsers.has(dummyUser)) { // Ensure user isn't already there
                    this.currentUsers.add(dummyUser);
                    this.usersInRoomSubject.next(Array.from(this.currentUsers));
                    this.messagesSubject.next({
                        user: 'Admin',
                        text: `${dummyUser} has joined (simulated).`,
                        timestamp: new Date().toISOString()
                    });
                    console.log(`[Dummy Backend] Simulated: ${dummyUser} joined.`);
                }
            }
        });

        // Simulate users leaving every 15-30 seconds
        interval(Math.random() * 15000 + 15000).subscribe(() => { // Between 15 and 30 seconds
            const usersArray = Array.from(this.currentUsers);
            // Exclude admin messages and the current client user from being simulated leaving
            const simulatableUsers = usersArray.filter(u => u !== 'Admin' && !u.startsWith('Guest'));
            if (simulatableUsers.length > 0) {
                const userToLeave = simulatableUsers[Math.floor(Math.random() * simulatableUsers.length)];
                this.currentUsers.delete(userToLeave);
                this.usersInRoomSubject.next(Array.from(this.currentUsers));
                this.messagesSubject.next({
                    user: 'Admin',
                    text: `${userToLeave} has left (simulated).`,
                    timestamp: new Date().toISOString()
                });
                console.log(`[Dummy Backend] Simulated: ${userToLeave} left.`);
            }
        });

        // Simulate dummy messages every 5-15 seconds
        interval(Math.random() * 10000 + 5000).subscribe(() => { // Between 5 and 15 seconds
            const usersArray = Array.from(this.currentUsers);
            const activeUsers = usersArray.filter(u => u !== 'Admin'); // Exclude admin from sending messages
            if (activeUsers.length > 0) {
                const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
                const dummyMessages = [
                    "Hello everyone!",
                    "How's it going?",
                    "Angular is awesome!",
                    "What are you working on today?",
                    "Just testing the chat.",
                    "Good morning!",
                    "Anyone got questions?",
                    "Nice to meet you all!"
                ];
                const randomMessage = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
                this.sendMessage(randomMessage, randomUser);
            }
        });
    }
}