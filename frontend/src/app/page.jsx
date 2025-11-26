'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, Camera, Home, Music, Utensils, Sparkles, CheckCircle, Star, UserPlus, Calendar, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CITIES } from '../constants/cities';
import api from '../services/api';
import VendorCard from '../components/VendorCard';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AskEventra from '../components/AskEventra';

export default function HomePage() {
    const [city, setCity] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [category, setCategory] = useState('');
    const [featuredVendors, setFeaturedVendors] = useState([]);
    const router = useRouter();

    const fetchFeaturedVendors = async () => {
        try {
            const { data } = await api.get('/vendors?limit=3');
            setFeaturedVendors(data.slice(0, 3));
        } catch (error) {
            console.error('Error fetching featured vendors:', error);
        }
    };

    useEffect(() => {
        fetchFeaturedVendors();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/vendors?city=${city}&category=${category}`);
    };

    const categories = [
        { name: 'Photographers', value: 'Photographer', icon: Camera, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' },
        { name: 'Venues', value: 'Venue', icon: Home, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300' },
        { name: 'Makeup Artists', value: 'Makeup Artist', icon: Sparkles, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300' },
        { name: 'Decorators', value: 'Decorator', icon: Music, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300' },
        { name: 'Caterers', value: 'Caterer', icon: Utensils, color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' },
    ];

    const steps = [
        {
            title: 'Search',
            description: 'Explore thousands of trusted wedding vendors in your city.',
            icon: Search,
        },
        {
            title: 'Shortlist',
            description: 'Save your favorites and compare quotes to find the best fit.',
            icon: Heart,
        },
        {
            title: 'Book',
            description: 'Connect directly and book your dream team for the big day.',
            icon: Calendar,
        },
    ];

    const testimonials = [
        {
            name: 'Priya & Rahul',
            role: 'Married in Mumbai',
            text: "Eventra made finding our photographer so easy! We loved the portfolio browsing feature.",
            image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=150&h=150&fit=crop&crop=faces'
        },
        {
            name: 'Sarah & Mike',
            role: 'Married in Goa',
            text: "The best platform for destination weddings. We found an amazing planner who handled everything.",
            image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=150&h=150&fit=crop&crop=faces'
        },
        {
            name: 'Anjali S.',
            role: 'Bride',
            text: "I found my makeup artist and mehndi artist here. Highly recommended for stress-free planning!",
            image: 'https://images.unsplash.com/photo-1623184663110-89ba5b565eb6?w=150&h=150&fit=crop&crop=faces'
        }
    ];

    return (
        <>
            <Head>
                <title>Eventra – Find Your Dream Wedding Vendors</title>
                <meta name="description" content="Search and book wedding photographers, venues, caterers, and more across India. Easy filtering by city and category." />
            </Head>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">

                {/* Hero Section */}
                <div className="relative h-[600px] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img src="/mainpic.webp" alt="Wedding background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                            Plan Your Dream <span className="text-rose-500">Indian Wedding</span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-md">
                            Find the best trusted vendors for your special day. From venues to photographers, we have it all.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 w-full max-w-4xl dark:bg-gray-800/95">
                            <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-4 py-3 relative bg-white dark:bg-gray-700 dark:border-gray-600">
                                <MapPin className="text-rose-500 mr-3" />
                                <input
                                    type="text"
                                    placeholder="City (e.g. Mumbai, Delhi)"
                                    className="w-full outline-none text-gray-700 bg-transparent dark:text-white placeholder-gray-400"
                                    value={city}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCity(val);
                                        if (val) {
                                            const filtered = CITIES.filter((c) => c.toLowerCase().includes(val.toLowerCase()));
                                            setCitySuggestions(filtered);
                                        } else {
                                            setCitySuggestions([]);
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setCitySuggestions([]), 200)}
                                />
                                {citySuggestions.length > 0 && (
                                    <ul role="listbox" className="absolute top-full left-0 bg-white border border-gray-200 mt-2 rounded-lg max-h-60 overflow-y-auto z-20 w-full shadow-xl dark:bg-gray-700 dark:border-gray-600">
                                        {citySuggestions.map((c) => (
                                            <li
                                                key={c}
                                                role="option"
                                                className="px-4 py-3 hover:bg-rose-50 cursor-pointer text-left dark:text-white dark:hover:bg-gray-600 transition-colors"
                                                onClick={() => {
                                                    setCity(c);
                                                    setCitySuggestions([]);
                                                }}
                                            >
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 dark:border-gray-600">
                                <Search className="text-rose-500 mr-3" />
                                <select
                                    className="w-full outline-none text-gray-700 bg-transparent dark:text-white cursor-pointer"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Photographer">Photographer</option>
                                    <option value="Venue">Venue</option>
                                    <option value="Makeup Artist">Makeup Artist</option>
                                    <option value="Decorator">Decorator</option>
                                    <option value="Caterer">Caterer</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-rose-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-rose-700 transition-all transform hover:scale-105 shadow-md"
                            >
                                Search
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Featured Categories */}
                <section className="py-20 px-4 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 dark:text-white">Browse by Category</h2>
                        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto dark:text-gray-400">Discover top-rated vendors for every aspect of your wedding.</p>

                        <div className="flex flex-wrap justify-center gap-8">
                            {categories.map((cat, idx) => (
                                <Link
                                    href={`/vendors?category=${cat.value}`}
                                    key={cat.name}
                                    className="group"
                                >
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className={`flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:bg-gray-800 dark:border-gray-700 ${idx === 2 ? 'w-40' : 'w-48'}`}
                                    >
                                        <div className={`p-5 rounded-full mb-4 ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <cat.icon size={32} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center">{cat.name}</h3>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Ask Eventra AI Chatbot */}
                <AskEventra />

                {/* How It Works */}
                <section className="py-20 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">How Eventra Works</h2>
                            <p className="text-gray-500 dark:text-gray-400">Planning your wedding is as easy as 1-2-3</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-6 dark:bg-rose-900 dark:text-rose-300">
                                        <step.icon size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{step.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Vendors */}
                {featuredVendors.length > 0 && (
                    <section className="py-20 px-4 max-w-7xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">Featured Vendors</h2>
                                    <p className="text-gray-500 dark:text-gray-400">Handpicked professionals for your special day</p>
                                </div>
                                <Link href="/vendors" className="text-rose-600 font-semibold hover:text-rose-700 flex items-center group">
                                    View All <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredVendors.map((vendor) => (
                                    <VendorCard key={vendor._id} vendor={vendor} />
                                ))}
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* Testimonials */}
                <section className="py-20 bg-rose-50 dark:bg-gray-800/50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white">What Couples Say</h2>
                    </div>

                    <div className="flex overflow-hidden w-full">
                        <motion.div
                            className="flex gap-8 px-4"
                            animate={{ x: "-50%" }}
                            initial={{ x: "0%" }}
                            transition={{
                                duration: 40,
                                ease: "linear",
                                repeat: Infinity
                            }}
                            style={{ width: "max-content" }}
                        >
                            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                                <div
                                    key={i}
                                    className="w-[400px] flex-shrink-0 bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-700 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center mb-6">
                                        <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-white">{t.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 mb-4">
                                        {[...Array(5)].map((_, starI) => <Star key={starI} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-gray-600 italic dark:text-gray-300">"{t.text}"</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Vendor Registration CTA */}
                <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=900&fit=crop" alt="Background" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Are you a Wedding Professional?</h2>
                            <p className="text-xl text-gray-300 mb-10">
                                Join thousands of vendors on Eventra and grow your business. Showcase your work, get reviews, and connect with couples.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/register?type=vendor"
                                    className="bg-rose-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-rose-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                                >
                                    <UserPlus className="mr-2" /> Register as Vendor
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center"
                                >
                                    Vendor Login
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

            </div>
        </>
    );
}
