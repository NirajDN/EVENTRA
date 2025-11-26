'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { CITIES } from '../../../constants/cities';
import { Plus, Trash, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorDashboard() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [profile, setProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Service Form State
    const [newService, setNewService] = useState({ name: '', description: '', price: '', category: '' });

    // Profile Form State
    const [profileData, setProfileData] = useState({
        businessName: '',
        city: '',
        category: '',
        priceRange: '',
        description: '',
        image: ''
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch profile first
            let profileData = null;
            try {
                const { data } = await api.get('/vendors/me');
                profileData = data;
                setProfile(data);

                setProfileData({
                    businessName: data.businessName || '',
                    city: data.city || '',
                    category: data.category || '',
                    priceRange: data.priceRange || '',
                    description: data.description || '',
                    image: data.images && data.images.length > 0 ? data.images[0] : ''
                });
            } catch (err) {
                console.log('No profile found, user needs to create one');
            }

            // Fetch bookings (only if profile exists, or maybe bookings are by user ID? assuming profile for now)
            // Actually, let's try to fetch bookings anyway, but if it fails, it fails.
            try {
                const { data } = await api.get('/bookings');
                setBookings(data);
            } catch (err) {
                console.log('Error fetching bookings', err);
            }

            if (profileData) {
                try {
                    const { data } = await api.get(`/services/${profileData._id}`);
                    setServices(data);
                } catch (err) {
                    console.log('Error fetching services', err);
                }
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookingStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}`, { status });
            toast.success(`Booking ${status}`);
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services', newService);
            toast.success('Service added');
            setNewService({ name: '', description: '', price: '', category: '' });
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add service');
        }
    };

    const handleDeleteService = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/services/${id}`);
            toast.success('Service deleted');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImageFile) return null;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedImageFile);

            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Image uploaded!');
            return data.url;
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            // Upload image first if a new one is selected
            let imageUrl = profileData.image;
            if (selectedImageFile) {
                const uploadedUrl = await handleImageUpload();
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            await api.post('/vendors', {
                ...profileData,
                images: imageUrl ? [imageUrl] : []
            });
            toast.success('Profile updated successfully');
            setSelectedImageFile(null);
            setImagePreview('');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Vendor Dashboard</h1>

            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                {['bookings', 'services', 'profile'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === tab
                            ? 'border-rose-500 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'bookings' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-md dark:bg-gray-800">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {bookings.map((booking) => (
                            <li key={booking._id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer?.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(booking.date).toLocaleDateString()}</p>
                                        {booking.notes && <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Note: {booking.notes}</p>}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleBookingStatus(booking._id, 'confirmed')}
                                                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        )}
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            booking.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <button
                                            onClick={() => window.location.href = `/dashboard/chat?userId=${booking.customer._id}&userName=${booking.customer.name}`}
                                            className="px-3 py-1 text-xs bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
                                        >
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {bookings.length === 0 && <li className="p-4 text-center text-gray-500 dark:text-gray-400">No bookings yet.</li>}
                    </ul>
                </div>
            )}

            {activeTab === 'services' && (
                <div className="space-y-6">
                    {!profile ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        You need to complete your <strong>Profile</strong> before you can add services.
                                        <button
                                            onClick={() => setActiveTab('profile')}
                                            className="ml-2 font-medium underline hover:text-yellow-600 dark:hover:text-yellow-300"
                                        >
                                            Go to Profile
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Add New Service</h3>
                            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Service Name"
                                    className="border p-2 rounded w-full mb-2 text-gray-900 bg-white placeholder:text-gray-500 shadow-sm border-gray-200 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className="border p-2 rounded w-full mb-2 text-gray-900 bg-white placeholder:text-gray-500 shadow-sm border-gray-200 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                    value={newService.price}
                                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    className="border p-2 rounded w-full mb-4 text-gray-900 bg-white placeholder:text-gray-500 shadow-sm border-gray-200 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                    value={newService.category}
                                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                />
                                <textarea
                                    placeholder="Description"
                                    className="border p-2 rounded w-full mb-2 text-gray-900 bg-white placeholder:text-gray-500 shadow-sm border-gray-200 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                />
                                <button type="submit" className="bg-rose-600 text-white p-2 rounded-md hover:bg-rose-700 flex items-center justify-center shadow-sm transition-colors">
                                    <Plus size={16} className="mr-2" /> Add Service
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div key={service._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{service.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">{service.description}</p>
                                    <p className="text-rose-600 font-semibold mt-2">₹{service.price}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteService(service._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Edit Profile</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white placeholder:text-gray-500 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                value={profileData.businessName}
                                onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white placeholder:text-gray-500 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                    value={profileData.city}
                                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                    required
                                    list="city-list"
                                />
                                <datalist id="city-list">
                                    {CITIES.map((c) => (
                                        <option value={c} key={c} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select
                                    className="border p-3 rounded-md w-full text-gray-900 bg-white placeholder:text-gray-500 shadow-sm border-gray-200 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    value={profileData.category}
                                    onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
                                    required
                                >
                                    <option value="" className="text-gray-500">Select Category</option>
                                    <option value="Photographer">Photographer</option>
                                    <option value="Venue">Venue</option>
                                    <option value="Makeup Artist">Makeup Artist</option>
                                    <option value="Decorator">Decorator</option>
                                    <option value="Caterer">Caterer</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white placeholder:text-gray-500 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                placeholder="e.g. ₹50,000 - ₹1,00,000"
                                value={profileData.priceRange}
                                onChange={(e) => setProfileData({ ...profileData, priceRange: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white placeholder:text-gray-500 focus:ring-rose-500 focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-400"
                                rows={4}
                                value={profileData.description}
                                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Profile Image</label>

                            {/* Show current or preview image */}
                            {(imagePreview || profileData.image) && (
                                <div className="mb-3">
                                    <img
                                        src={imagePreview || profileData.image}
                                        alt="Profile preview"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                                    />
                                </div>
                            )}

                            {/* File upload input */}
                            <div className="flex items-center space-x-3">
                                <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                    Choose Image
                                </label>
                                {selectedImageFile && (
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedImageFile.name}</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">Upload an image from your device (max 5MB)</p>
                        </div>
                        <button
                            type="submit"
                            disabled={uploadingImage}
                            className="bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700 shadow-sm transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploadingImage ? 'Uploading...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
