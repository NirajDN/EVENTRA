'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import ChatWindow from '../../../components/ChatWindow';
import ProfilePictureUpload from '../../../components/ProfilePictureUpload';
import api from '../../../services/api';
import { MessageCircle } from 'lucide-react';
import { io } from 'socket.io-client';

function ChatContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user) {
            fetchConversations();

            // Initialize socket connection for real-time updates
            const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001');
            setSocket(newSocket);

            newSocket.on('profileUpdated', (data) => {
                // Update conversations list
                setConversations((prev) =>
                    prev.map((conv) =>
                        conv._id === data.userId ? { ...conv, profilePicture: data.newImage } : conv
                    )
                );

                // Update selected user if it matches
                setSelectedUser((prev) => {
                    if (prev && prev._id === data.userId) {
                        return { ...prev, profilePicture: data.newImage };
                    }
                    return prev;
                });
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);

    useEffect(() => {
        // Check if userId and userName are in URL params
        const userId = searchParams.get('userId');
        const userName = searchParams.get('userName');

        if (userId && userName && !selectedUser) {
            // Create a temporary conversation object for the selected user
            // We might not have the profile picture here immediately if coming from another page
            // But fetchConversations will likely update it if a conversation exists
            setSelectedUser({
                _id: userId,
                name: userName,
                email: '',
                role: '',
                lastMessage: '',
                lastMessageTime: ''
            });
        }
    }, [searchParams, selectedUser]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);

            // If we have a selected user from params but no details, try to find them in fetched conversations
            // to get their profile picture
            if (selectedUser && !selectedUser.profilePicture) {
                const found = data.find((c) => c._id === selectedUser._id);
                if (found) {
                    setSelectedUser(found);
                }
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Please login to access chat</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {/* Conversations List */}
                    <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
                        <ProfilePictureUpload
                            onProfileUpdate={(newUrl) => {
                                if (socket && user) {
                                    socket.emit('profileUpdate', { userId: user._id, newImage: newUrl });
                                }
                            }}
                        />
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h2>
                        </div>
                        <div className="overflow-y-auto h-full">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading...</div>
                            ) : conversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No conversations yet</p>
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv._id}
                                        onClick={() => setSelectedUser(conv)}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${selectedUser?._id === conv._id ? 'bg-rose-50 dark:bg-gray-700' : ''
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-200 overflow-hidden">
                                                {conv.profilePicture ? (
                                                    <img src={conv.profilePicture} alt={conv.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-rose-600 flex items-center justify-center text-white font-semibold">
                                                        {conv.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {conv.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {conv.lastMessage || 'No messages yet'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="md:col-span-2">
                        {selectedUser ? (
                            <ChatWindow
                                recipientId={selectedUser._id}
                                recipientName={selectedUser.name}
                                recipientImage={selectedUser.profilePicture}
                            />
                        ) : (
                            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Select a conversation to start chatting</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading chat...</div>}>
            <ChatContent />
        </Suspense>
    );
}
