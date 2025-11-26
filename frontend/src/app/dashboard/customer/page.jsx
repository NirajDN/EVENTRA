'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Calendar, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    if (loading) return <div className="p-8 text-center dark:text-white">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h1>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map((booking) => (
                        <li key={booking._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-rose-600 dark:text-rose-400 truncate">
                                        {booking.vendor?.businessName || 'Vendor Removed'}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </p>
                                        {booking.vendor && booking.vendor.user && (
                                            <button
                                                onClick={() => window.location.href = `/dashboard/chat?userId=${booking.vendor.user._id}&userName=${booking.vendor.user.name}`}
                                                className="px-3 py-1 text-xs bg-rose-600 text-white rounded-md hover:bg-rose-700 transition dark:bg-rose-600 dark:hover:bg-rose-700"
                                            >
                                                Chat
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                            {booking.vendor?.city || 'N/A'}
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                                            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                            {new Date(booking.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        <p>
                                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {booking.notes && (
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-gray-900 dark:text-gray-300">Note:</span> {booking.notes}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                    {bookings.length === 0 && (
                        <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No bookings found. Start exploring vendors!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
