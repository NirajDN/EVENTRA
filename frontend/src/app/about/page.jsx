'use client';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-white shadow-sm dark:bg-gray-800">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl dark:text-white">
                        About <span className="text-rose-600">Eventra</span>
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                        Your one-stop destination for planning the perfect Indian wedding.
                    </p>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose Eventra?</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center dark:text-white">Trusted Vendors</h3>
                        <p className="text-gray-600 text-center dark:text-gray-300">
                            Every vendor is verified to ensure high quality services for your big day. We handpick the best professionals in the industry.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center dark:text-white">Transparent Pricing</h3>
                        <p className="text-gray-600 text-center dark:text-gray-300">
                            No hidden costs. View prices and packages upfront before booking. Compare quotes easily and stay within your budget.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center dark:text-white">Easy Booking</h3>
                        <p className="text-gray-600 text-center dark:text-gray-300">
                            Connect with vendors and manage your bookings all in one place. Streamline your wedding planning process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
