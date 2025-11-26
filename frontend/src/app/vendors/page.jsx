'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../services/api';
import VendorCard from '../../components/VendorCard';
import { Filter } from 'lucide-react';

function VendorListingContent() {
    const searchParams = useSearchParams();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState('');

    useEffect(() => {
        fetchVendors();
    }, [city, category, priceRange]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (city) params.append('city', city);
            if (category) params.append('category', category);
            if (priceRange) params.append('priceRange', priceRange);

            if (!api) {
                console.error('API client is not defined');
                return;
            }
            const { data } = await api.get(`/vendors?${params.toString()}`);
            setVendors(data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center mb-4">
                            <Filter className="w-5 h-5 text-rose-600 mr-2" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">City</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Category</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm p-2 border text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    <option value="Photographer">Photographer</option>
                                    <option value="Venue">Venue</option>
                                    <option value="Makeup Artist">Makeup Artist</option>
                                    <option value="Decorator">Decorator</option>
                                    <option value="Caterer">Caterer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Price Range</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm p-2 border text-gray-900 placeholder:text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="e.g. Budget, 50000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vendor Grid */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
                        {vendors.length} Vendors Found
                    </h1>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-80 bg-gray-200 rounded-xl animate-pulse dark:bg-gray-700"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vendors.map((vendor) => (
                                <VendorCard key={vendor._id} vendor={vendor} />
                            ))}
                        </div>
                    )}

                    {!loading && vendors.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg dark:text-gray-400">No vendors found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VendorListingPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <VendorListingContent />
        </Suspense>
    );
}
