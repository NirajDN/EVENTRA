'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AskEventra() {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hi! I'm Ask Eventra, your personal wedding AI assistant. Ask me anything about wedding planning, ideas, or how to improve your special day!",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI delay and response
        setTimeout(() => {
            const botResponse = generateResponse(userMessage.text);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (input) => {
        const lowerInput = input.toLowerCase();

        // Budget & Planning
        if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('price')) {
            return "Budgeting is key! A typical Indian wedding budget breakdown: 40-50% for Venue & Catering, 15% for Jewelry, 10% for Decor, 10% for Photography, and the rest for Attire, Makeup, and Entertainment. I can help you find vendors within your specific range if you tell me your city!";
        }

        // Venues
        if (lowerInput.includes('venue') || lowerInput.includes('location') || lowerInput.includes('destination')) {
            return "Choosing a venue sets the tone! For a royal feel, look for palaces in Rajasthan. For a beach vibe, Goa or Kerala are perfect. For city weddings, banquet halls and 5-star hotels offer great convenience. Have you checked the 'Venues' category above to see top-rated options near you?";
        }

        // Themes & Decor
        if (lowerInput.includes('theme') || lowerInput.includes('idea') || lowerInput.includes('trend')) {
            return "Trending themes for 2025 include 'Sustainable Chic' (eco-friendly decor), 'Royal Vintage' (velvet & gold), and 'Tropical Paradise' (bright florals). Pastel themes are also timeless for daytime weddings. What kind of vibe are you looking for?";
        }
        if (lowerInput.includes('flower') || lowerInput.includes('floral') || lowerInput.includes('decor')) {
            return "Flowers bring life to any wedding! Marigolds (Genda) are classic for Haldi/Mehndi. For receptions, pastel roses, orchids, and hydrangeas are trending. Pro tip: Use seasonal local flowers to save costs without compromising on beauty!";
        }

        // Food & Catering
        if (lowerInput.includes('food') || lowerInput.includes('menu') || lowerInput.includes('catering') || lowerInput.includes('cuisine') || lowerInput.includes('dish')) {
            return "Food is the heart of an Indian wedding! Popular trends include: 1) Live Chaat & Pasta Counters, 2) Fusion Menus (e.g., Tacos with Indian fillings), 3) Regional Specialties (like authentic Rajasthani or South Indian spreads). Don't forget a grand dessert station with Jalebi-Rabdi or exotic pastries!";
        }

        // Photography
        if (lowerInput.includes('photo') || lowerInput.includes('video') || lowerInput.includes('shoot')) {
            return "For photography, 'Candid' and 'Cinematic' styles are most popular. Make sure to book your photographer at least 6 months in advance. Pre-wedding shoots at scenic locations are a great way to get comfortable with the camera before the big day!";
        }

        // Makeup & Attire
        if (lowerInput.includes('makeup') || lowerInput.includes('hair') || lowerInput.includes('look') || lowerInput.includes('beauty')) {
            return "For makeup, the 'No-Makeup' makeup look and 'Dewy Glass Skin' are huge trends. Traditional red lips and bold eyes remain a classic for the main wedding day. Always book a trial session with your makeup artist to ensure you're happy with the look!";
        }
        if (lowerInput.includes('dress') || lowerInput.includes('lehenga') || lowerInput.includes('saree') || lowerInput.includes('sherwani')) {
            return "Pastel lehengas are still going strong, but deep jewel tones (emerald green, wine red) are making a comeback. For grooms, floral safas and asymmetrical sherwanis are trendy. Comfort is just as important as style for long ceremonies!";
        }

        // Music & Entertainment
        if (lowerInput.includes('music') || lowerInput.includes('dj') || lowerInput.includes('song') || lowerInput.includes('dance')) {
            return "Entertainment makes the party! A mix of Bollywood chartbusters and classic wedding songs works best. Live bands or Sufi nights are great for Sangeet. Don't forget to prepare a fun bride/groom entry song!";
        }

        // Invitations
        if (lowerInput.includes('invite') || lowerInput.includes('card') || lowerInput.includes('invitation')) {
            return "Digital invitations (e-invites) are eco-friendly and easy to share on WhatsApp. For physical cards, boxed invitations with sweets or dry fruits add a premium touch. Video invites are also very popular now!";
        }

        // Jewelry
        if (lowerInput.includes('jewelry') || lowerInput.includes('jewellery') || lowerInput.includes('gold')) {
            return "Polki and Kundan sets are timeless for the wedding day. For pre-wedding functions, floral jewelry or lightweight diamond/platinum pieces are trendy. Layering necklaces is a great way to add grandeur!";
        }

        return "That's a great question! While I'm still learning, I suggest browsing our 'Find Vendors' section to connect with experts who can make that happen. Is there anything specific about decor, food, venues, or planning you'd like to know?";
    };

    return (
        <section className="py-16 bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-4">
                        <Sparkles className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ask Eventra</h2>
                    <p className="text-gray-600 dark:text-gray-400">Your AI Wedding Planner & Idea Generator</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 h-[400px] md:h-[500px] flex flex-col">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start max-w-[85%] md:max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mx-2 ${msg.sender === 'user'
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-indigo-600 text-white'
                                        }`}>
                                        {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-3 md:p-4 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-rose-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm ml-12">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask about wedding themes..."
                                className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm md:text-base"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                className="p-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
