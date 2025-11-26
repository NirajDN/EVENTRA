'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../services/api';
import { Star, MapPin, Calendar, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export default function VendorDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [vendor, setVendor] = useState(null);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Booking state
    const [bookingDate, setBookingDate] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    // Review state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        if (id) {
            console.log('Fetching details for vendor ID:', id);
            fetchVendorDetails();
        }
    }, [id]);

    const fetchVendorDetails = async () => {
        try {
            const [vendorRes, servicesRes, reviewsRes] = await Promise.all([
                api.get(`/vendors/${id}`),
                api.get(`/services/${id}`),
                api.get(`/reviews/${id}`)
            ]);
            setVendor(vendorRes.data);
            setServices(servicesRes.data);
            setReviews(reviewsRes.data);
        } catch (error) {
            console.error('Error fetching details:', error);
            toast.error('Failed to load vendor details');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to book a vendor');
            return;
        }

        setBookingLoading(true);
        try {
            await api.post('/bookings', {
                vendorId: id,
                date: bookingDate,
                notes: bookingNotes
            });
            toast.success('Booking request sent successfully!');
            setBookingDate('');
            setBookingNotes('');
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to write a review');
            return;
        }

        setReviewLoading(true);
        try {
            await api.post('/reviews', {
                vendorId: id,
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success('Review submitted successfully!');
            setReviewComment('');
            setReviewRating(5);
            setShowReviewForm(false);

            // Refresh reviews and vendor details
            const [reviewsRes, vendorRes] = await Promise.all([
                api.get(`/reviews/${id}`),
                api.get(`/vendors/${id}`)
            ]);
            setReviews(reviewsRes.data);
            setVendor(vendorRes.data);
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!vendor) return <div className="p-8 text-center">Vendor not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="h-64 md:h-96 w-full relative">
                    <img
                        src={vendor.images[0] || 'https://via.placeholder.com/1200x400'}
                        alt={vendor.businessName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{vendor.businessName}</h1>
                        <div className="flex items-center space-x-4 text-sm md:text-base">
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {vendor.city}</span>
                            <span className="bg-white/20 px-2 py-1 rounded">{vendor.category}</span>
                            <span className="flex items-center text-yellow-400"><Star className="w-4 h-4 mr-1 fill-current" /> {vendor.rating.toFixed(1)} ({vendor.numReviews} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                        <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
                    </section>

                    {/* Services */}
                    <section className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Services & Pricing</h2>
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div key={service._id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                                        </div>
                                        <span className="font-bold text-rose-600 text-lg">₹{service.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                            {services.length === 0 && <p className="text-gray-500">No services listed yet.</p>}
                        </div>
                    </section>

                    {/* Reviews */}
                    <section className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h2>
                            {user && user.role === 'customer' && (
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="text-rose-600 hover:text-rose-700 font-medium text-sm"
                                >
                                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                                </button>
                            )}
                        </div>

                        {showReviewForm && (
                            <form onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Write a Review</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Rating</label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-6 h-6 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Comment</label>
                                    <textarea
                                        rows={3}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 p-2 border text-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                        placeholder="Share your experience..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={reviewLoading}
                                    className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition disabled:opacity-50"
                                >
                                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        )}

                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900 dark:text-white">{review.customer?.name || 'Anonymous'}</span>
                                        <div className="flex items-center text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                            {reviews.length === 0 && <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 sticky top-24 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Vendor</h3>
                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 pl-10 p-2 border text-gray-900 bg-white placeholder:text-gray-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-400"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                    <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message / Notes</label>
                                <textarea
                                    rows={4}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 p-2 border text-gray-900 bg-white placeholder:text-gray-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-400"
                                    placeholder="Describe your event requirements..."
                                    value={bookingNotes}
                                    onChange={(e) => setBookingNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={bookingLoading}
                                className="w-full bg-rose-600 text-white py-3 rounded-md font-semibold hover:bg-rose-700 transition disabled:opacity-50"
                            >
                                {bookingLoading ? 'Sending Request...' : 'Send Booking Request'}
                            </button>

                            {user && user.role === 'customer' && (
                                <button
                                    type="button"
                                    onClick={() => window.location.href = `/dashboard/chat?userId=${vendor.user._id}&userName=${vendor.user.name}`}
                                    className="w-full bg-white text-rose-600 py-3 rounded-md font-semibold border-2 border-rose-600 hover:bg-rose-50 transition mt-2"
                                >
                                    Chat with Vendor
                                </button>
                            )}

                            <p className="text-xs text-center text-gray-500 mt-4">
                                You won&apos;t be charged yet. The vendor will confirm your booking request.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
