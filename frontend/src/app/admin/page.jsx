'use client';

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Check, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('vendors');
    const [users, setUsers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = async () => {
        try {
            const usersRes = await api.get('/admin/users');
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Failed to load users');
        }

        try {
            const vendorsRes = await api.get('/admin/vendors');
            setVendors(vendorsRes.data);
        } catch (error) {
            console.error('Error loading vendors:', error);
            toast.error('Failed to load vendors');
        }

        try {
            const bookingsRes = await api.get('/admin/bookings');
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error loading bookings:', error);
            toast.error('Failed to load bookings');
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleVerifyVendor = async (id) => {
        try {
            await api.put(`/admin/vendors/${id}/verify`);
            toast.success('Vendor status updated');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to update vendor status');
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            await api.delete(`/admin/bookings/${id}`);
            toast.success('Booking deleted');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to delete booking');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-rose-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>

            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                {['vendors', 'users', 'bookings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === tab
                            ? 'border-rose-500 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'vendors' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md dark:bg-gray-800">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {vendors.map((vendor) => (
                            <li key={vendor._id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{vendor.businessName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.city} • {vendor.category}</p>
                                        <p className="text-xs text-gray-400 mt-1">Owner: {vendor.user?.name} ({vendor.user?.email})</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendor.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {vendor.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                        <button
                                            onClick={() => handleVerifyVendor(vendor._id)}
                                            className={`p-2 rounded-full ${vendor.isVerified
                                                ? 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                                                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                }`}
                                            title={vendor.isVerified ? 'Revoke Verification' : 'Verify Vendor'}
                                        >
                                            {vendor.isVerified ? <X size={16} /> : <Check size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md dark:bg-gray-800">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <li key={user._id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        {user.role}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'bookings' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md dark:bg-gray-800">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {bookings.map((booking) => (
                            <li key={booking._id} className="px-4 py-4 sm:px-6">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                Customer: <span className="font-normal">{booking.customer?.name} ({booking.customer?.email})</span>
                                            </p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                                Vendor: <span className="font-normal">{booking.vendor?.businessName || 'Unknown Vendor'} ({booking.vendor?.city || 'N/A'})</span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Service Category: {booking.vendor?.category || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                booking.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteBooking(booking._id)}
                                                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                                title="Delete Booking"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Booking Date: {new Date(booking.date).toLocaleDateString()}
                                        </p>
                                        {booking.notes && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Notes: {booking.notes}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            Created: {new Date(booking.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {bookings.length === 0 && (
                            <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No bookings found in the system.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
