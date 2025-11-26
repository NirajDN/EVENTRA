'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Code } from 'lucide-react';

export default function DeveloperPage() {
    const [developer, setDeveloper] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeveloperInfo();
    }, []);

    const fetchDeveloperInfo = async () => {
        try {
            const response = await fetch('https://api.github.com/users/NirajDN');
            const data = await response.json();
            setDeveloper(data);
        } catch (error) {
            console.error('Error fetching developer info:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Meet the Developer</h1>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">The mind behind Eventra</p>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
                    </div>
                ) : developer ? (
                    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
                        <div className="h-32 bg-gradient-to-r from-rose-500 to-pink-600"></div>
                        <div className="flex justify-center -mt-16">
                            <img
                                className="h-32 w-32 rounded-full border-4 border-white object-cover bg-white dark:border-gray-800 dark:bg-gray-800"
                                src={developer.avatar_url}
                                alt={developer.name}
                            />
                        </div>
                        <div className="text-center px-6 py-4">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{developer.name || 'NirajDN'}</h3>
                            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">@{developer.login}</p>
                            <p className="text-gray-700 mb-6 dark:text-gray-300">{developer.bio || 'Full Stack Developer | Building awesome things for the web.'}</p>

                            <div className="flex justify-center space-x-6 mb-6">
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-gray-900 dark:text-white">{developer.public_repos}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Repositories</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-gray-900 dark:text-white">{developer.followers}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xl font-bold text-gray-900 dark:text-white">{developer.following}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-4">
                                {/* GitHub */}
                                <a
                                    href="https://github.com/NirajDN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    <Github className="w-4 h-4 mr-2" />
                                    GitHub
                                </a>
                                {/* Website (if available) */}
                                {developer.blog && (
                                    <a
                                        href={developer.blog.startsWith('http') ? developer.blog : `https://${developer.blog}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Website
                                    </a>
                                )}
                                {/* LinkedIn */}
                                <a
                                    href="https://www.linkedin.com/in/nirajdn/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    <Linkedin className="w-4 h-4 mr-2" />
                                    LinkedIn
                                </a>
                                {/* LeetCode */}
                                <a
                                    href="https://leetcode.com/u/NirajDn/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    <Code className="w-4 h-4 mr-2" />
                                    LeetCode
                                </a>
                                {/* Codolio */}
                                <a
                                    href="https://codolio.com/profile/NirajDN10"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                                >
                                    <Code className="w-4 h-4 mr-2" />
                                    Codolio
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        Failed to load developer profile.
                    </div>
                )}
            </div>
        </div>
    );
}
