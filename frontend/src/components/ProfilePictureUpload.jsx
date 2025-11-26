'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePictureUpload({ onProfileUpdate }) {
    const { user, setUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            // Upload image to Cloudinary
            const formData = new FormData();
            formData.append('image', selectedFile);

            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update user profile with new picture URL
            const response = await api.put('/auth/profile', {
                profilePicture: data.url
            });

            setUser(response.data);
            if (onProfileUpdate) {
                onProfileUpdate(data.url);
            }
            toast.success('Profile picture updated!');
            setShowModal(false);
            setSelectedFile(null);
            setPreview(null);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload picture');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center text-white font-semibold text-xl overflow-hidden">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        <Camera className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                </div>
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Profile Picture</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {preview && (
                                <div className="flex justify-center">
                                    <img src={preview} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                            />

                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                                className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
