'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 dark:bg-gray-900 dark:border-b dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-rose-600">Eventra</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/vendors"
                                className="border-transparent text-gray-500 hover:border-rose-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Find Vendors
                            </Link>
                            <Link
                                href="/about"
                                className="border-transparent text-gray-500 hover:border-rose-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/developer"
                                className="border-transparent text-gray-500 hover:border-rose-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Meet Developer
                            </Link>
                            {user && user.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="border-transparent text-rose-600 hover:border-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Admin Control
                                </Link>
                            )}
                            {/* Add more links as needed */}
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center space-x-4">
                        <ThemeToggle />
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer'}
                                    className="text-gray-700 hover:text-rose-600 font-medium dark:text-gray-200 dark:hover:text-rose-400"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/chat"
                                    className="text-gray-700 hover:text-rose-600 font-medium dark:text-gray-200 dark:hover:text-rose-400"
                                >
                                    Messages
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-full text-gray-500 hover:text-rose-600 focus:outline-none dark:text-gray-400 dark:hover:text-rose-400"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <Link
                                    href="/login"
                                    className="text-gray-500 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-rose-400"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <div className="mr-4">
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500 dark:hover:bg-gray-800"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/vendors"
                            className="bg-rose-50 border-rose-500 text-rose-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:bg-rose-900/20 dark:text-rose-400"
                        >
                            Find Vendors
                        </Link>
                        <Link
                            href="/about"
                            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/developer"
                            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                            Meet Developer
                        </Link>
                        {user && user.role === 'admin' && (
                            <Link
                                href="/admin"
                                className="border-transparent text-rose-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-rose-400 dark:hover:bg-rose-900/20 dark:hover:text-rose-300"
                            >
                                Admin Control
                            </Link>
                        )}
                        {!user && (
                            <>
                                <Link
                                    href="/login"
                                    className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Link
                                    href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer'}
                                    className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/chat"
                                    className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                                >
                                    Messages
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
