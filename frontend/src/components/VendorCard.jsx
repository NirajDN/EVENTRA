'use client';

import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

const VendorCard = ({ vendor }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition transform overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="h-48 w-full bg-gray-200 relative">
                <img
                    src={vendor.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">
                    {vendor.category}
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 truncate dark:text-white">{vendor.businessName}</h3>
                    <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded text-green-700 text-xs font-bold">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {vendor.rating.toFixed(1)}
                    </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm mt-2 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {vendor.city}
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium dark:text-gray-300">{vendor.priceRange}</span>
                    <Link
                        href={`/vendors/${vendor._id}`}
                        className="text-rose-600 hover:text-rose-700 text-sm font-semibold"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VendorCard;
