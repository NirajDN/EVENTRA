'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';
import api from '../services/api';

export default function ChatWindow({ recipientId, recipientName, recipientImage }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchChatHistory = async () => {
        try {
            const { data } = await api.get(`/chat/${recipientId}`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user) return;

        // Initialize socket connection
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001');
        setSocket(newSocket);

        // Join user's room
        newSocket.emit('join', user._id);

        // Listen for incoming messages
        newSocket.on('receiveMessage', (message) => {
            if (
                (message.sender === recipientId && message.receiver === user._id) ||
                (message.sender === user._id && message.receiver === recipientId)
            ) {
                setMessages((prev) => [...prev, message]);
            }
        });

        // Fetch chat history
        fetchChatHistory();

        return () => {
            newSocket.disconnect();
        };
    }, [user, recipientId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !user) return;

        const messageData = {
            sender: user._id,
            receiver: recipientId,
            content: newMessage.trim()
        };

        socket.emit('sendMessage', messageData);
        setNewMessage('');
    };

    if (!user) {
        return <div className="p-4 text-center">Please login to chat</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-200 overflow-hidden">
                    {recipientImage ? (
                        <img src={recipientImage} alt={recipientName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-rose-600 flex items-center justify-center text-white font-semibold">
                            {recipientName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{recipientName}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={msg._id || index}
                        className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start items-end'}`}
                    >
                        {msg.sender !== user._id && (
                            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-200 overflow-hidden mr-2 mb-1">
                                {recipientImage ? (
                                    <img src={recipientImage} alt={recipientName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-rose-600 flex items-center justify-center text-white text-xs font-semibold">
                                        {recipientName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        )}
                        <div
                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${msg.sender === user._id
                                ? 'bg-rose-600 text-white'
                                : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                                }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                            {msg.createdAt && (
                                <p className="text-xs mt-1 opacity-75">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
