const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const VendorProfile = require('./src/models/VendorProfile');
const Service = require('./src/models/Service');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventra');
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    try {
        // Clear existing data
        await User.deleteMany();
        await VendorProfile.deleteMany();
        await Service.deleteMany();

        console.log('Data Cleared');

        // Create Users
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
        });

        const vendor1 = await User.create({
            name: 'Rahul Sharma',
            email: 'rahul@photography.com',
            password: 'password123',
            role: 'vendor',
        });

        const vendor2 = await User.create({
            name: 'Priya Singh',
            email: 'priya@venue.com',
            password: 'password123',
            role: 'vendor',
        });

        const customer1 = await User.create({
            name: 'Amit Patel',
            email: 'amit@example.com',
            password: 'password123',
            role: 'customer',
        });

        // Create Vendor Profiles
        const profile1 = await VendorProfile.create({
            user: vendor1._id,
            businessName: 'Royal Wedding Photography',
            city: 'Mumbai',
            category: 'Photographer',
            description: 'Capturing your special moments with an Indian touch. Specialists in Candid and Traditional photography.',
            priceRange: '₹50,000 - ₹2,00,000',
            images: [
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Indian Bride
                'https://images.unsplash.com/photo-1595524366670-bf1775454385?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'  // Couple
            ],
            rating: 4.8,
            numReviews: 12,
            isVerified: true,
            contactEmail: 'contact@royalphoto.com',
            contactPhone: '9876543210',
        });

        const profile2 = await VendorProfile.create({
            user: vendor2._id,
            businessName: 'The Grand Palace',
            city: 'Delhi',
            category: 'Venue',
            description: 'A luxurious venue for your big fat Indian wedding. Capacity: 1000 guests.',
            priceRange: '₹5,00,000 - ₹15,00,000',
            images: [
                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Venue
                'https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'  // Decor
            ],
            rating: 4.5,
            numReviews: 8,
            isVerified: true,
            contactEmail: 'info@grandpalace.com',
            contactPhone: '9123456780',
        });

        const vendor3 = await User.create({
            name: 'Meera Desai',
            email: 'meera@makeupstudio.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile3 = await VendorProfile.create({
            user: vendor3._id,
            businessName: 'Meera\'s Bridal Makeup Studio',
            city: 'Bangalore',
            category: 'Makeup Artist',
            description: 'Professional bridal makeup with 10+ years of experience. Specializing in HD makeup, airbrush, and traditional looks.',
            priceRange: '₹25,000 - ₹80,000',
            images: [
                'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.9,
            numReviews: 25,
            isVerified: true,
            contactEmail: 'contact@meeramakeup.com',
            contactPhone: '9988776655',
        });

        const vendor4 = await User.create({
            name: 'Arjun Mehta',
            email: 'arjun@decorators.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile4 = await VendorProfile.create({
            user: vendor4._id,
            businessName: 'Arjun Event Decorators',
            city: 'Pune',
            category: 'Decorator',
            description: 'Creating magical wedding experiences with stunning floral arrangements and thematic decorations. From traditional to contemporary designs.',
            priceRange: '₹1,50,000 - ₹8,00,000',
            images: [
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.7,
            numReviews: 18,
            isVerified: true,
            contactEmail: 'events@arjundecor.com',
            contactPhone: '9876501234',
        });

        const vendor5 = await User.create({
            name: 'Kavita Iyer',
            email: 'kavita@catering.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile5 = await VendorProfile.create({
            user: vendor5._id,
            businessName: 'Kavita\'s Royal Catering',
            city: 'Hyderabad',
            category: 'Caterer',
            description: 'Authentic Indian cuisine with a modern twist. Specializing in North Indian, South Indian, and fusion menus. Serving 100-2000 guests.',
            priceRange: '₹800 - ₹2,500 per plate',
            images: [
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.6,
            numReviews: 32,
            isVerified: true,
            contactEmail: 'bookings@kavitacatering.com',
            contactPhone: '9123450987',
        });

        // Additional Photographers
        const vendor6 = await User.create({
            name: 'Vikram Reddy',
            email: 'vikram@snapmoments.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile6 = await VendorProfile.create({
            user: vendor6._id,
            businessName: 'Snap Moments Photography',
            city: 'Chennai',
            category: 'Photographer',
            description: 'Award-winning wedding photographers specializing in destination weddings and cinematic storytelling.',
            priceRange: '₹75,000 - ₹3,00,000',
            images: [
                'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.7,
            numReviews: 15,
            isVerified: true,
            contactEmail: 'info@snapmoments.com',
            contactPhone: '9445566778',
        });

        const vendor7 = await User.create({
            name: 'Anjali Kapoor',
            email: 'anjali@dreamframes.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile7 = await VendorProfile.create({
            user: vendor7._id,
            businessName: 'Dream Frames Studio',
            city: 'Jaipur',
            category: 'Photographer',
            description: 'Capturing royal Rajasthani weddings with traditional and contemporary styles. 8+ years experience.',
            priceRange: '₹60,000 - ₹2,50,000',
            images: [
                'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.6,
            numReviews: 20,
            isVerified: true,
            contactEmail: 'contact@dreamframes.com',
            contactPhone: '9887766554',
        });

        // Additional Venues
        const vendor8 = await User.create({
            name: 'Rajesh Kumar',
            email: 'rajesh@royalgardens.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile8 = await VendorProfile.create({
            user: vendor8._id,
            businessName: 'Royal Gardens & Banquets',
            city: 'Kolkata',
            category: 'Venue',
            description: 'Elegant outdoor and indoor venues with lush gardens. Perfect for traditional Bengali weddings. Capacity: 800 guests.',
            priceRange: '₹4,00,000 - ₹12,00,000',
            images: [
                'https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.4,
            numReviews: 12,
            isVerified: true,
            contactEmail: 'bookings@royalgardens.com',
            contactPhone: '9334455667',
        });

        const vendor9 = await User.create({
            name: 'Sanjay Malhotra',
            email: 'sanjay@heritagepalace.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile9 = await VendorProfile.create({
            user: vendor9._id,
            businessName: 'Heritage Palace Hotel',
            city: 'Udaipur',
            category: 'Venue',
            description: 'Luxurious heritage property with lake views. Ideal for destination weddings. Capacity: 500 guests.',
            priceRange: '₹8,00,000 - ₹25,00,000',
            images: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.9,
            numReviews: 28,
            isVerified: true,
            contactEmail: 'events@heritagepalace.com',
            contactPhone: '9223344556',
        });

        // Additional Makeup Artists
        const vendor10 = await User.create({
            name: 'Pooja Sharma',
            email: 'pooja@glamstudio.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile10 = await VendorProfile.create({
            user: vendor10._id,
            businessName: 'Glam & Glow Makeup Studio',
            city: 'Mumbai',
            category: 'Makeup Artist',
            description: 'Celebrity makeup artist specializing in bridal makeovers. MAC certified with 12+ years experience.',
            priceRange: '₹35,000 - ₹1,20,000',
            images: [
                'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.8,
            numReviews: 35,
            isVerified: true,
            contactEmail: 'book@glamstudio.com',
            contactPhone: '9876123456',
        });

        const vendor11 = await User.create({
            name: 'Nisha Patel',
            email: 'nisha@beautybliss.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile11 = await VendorProfile.create({
            user: vendor11._id,
            businessName: 'Beauty Bliss by Nisha',
            city: 'Ahmedabad',
            category: 'Makeup Artist',
            description: 'Natural and elegant bridal makeup. Specializing in Gujarati brides with traditional and modern looks.',
            priceRange: '₹20,000 - ₹65,000',
            images: [
                'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.5,
            numReviews: 18,
            isVerified: true,
            contactEmail: 'nisha@beautybliss.com',
            contactPhone: '9665544332',
        });

        // Additional Decorators
        const vendor12 = await User.create({
            name: 'Karan Singh',
            email: 'karan@dreamdecor.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile12 = await VendorProfile.create({
            user: vendor12._id,
            businessName: 'Dream Decor & Events',
            city: 'Gurgaon',
            category: 'Decorator',
            description: 'Luxury wedding decorators with expertise in floral mandaps, stage setups, and lighting. 500+ weddings completed.',
            priceRange: '₹2,00,000 - ₹10,00,000',
            images: [
                'https://images.unsplash.com/photo-1530023367847-a683933f4172?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.8,
            numReviews: 42,
            isVerified: true,
            contactEmail: 'info@dreamdecor.com',
            contactPhone: '9811223344',
        });

        const vendor13 = await User.create({
            name: 'Deepak Joshi',
            email: 'deepak@floralmagic.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile13 = await VendorProfile.create({
            user: vendor13._id,
            businessName: 'Floral Magic Decorators',
            city: 'Lucknow',
            category: 'Decorator',
            description: 'Specialists in traditional North Indian wedding decorations with fresh flowers and elegant draping.',
            priceRange: '₹1,00,000 - ₹6,00,000',
            images: [
                'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.4,
            numReviews: 22,
            isVerified: true,
            contactEmail: 'contact@floralmagic.com',
            contactPhone: '9556677889',
        });

        // Additional Caterers
        const vendor14 = await User.create({
            name: 'Ramesh Gupta',
            email: 'ramesh@tastytreats.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile14 = await VendorProfile.create({
            user: vendor14._id,
            businessName: 'Tasty Treats Catering',
            city: 'Delhi',
            category: 'Caterer',
            description: 'Multi-cuisine catering with live counters. Specializing in North Indian, Chinese, and Continental. Serving 50-1500 guests.',
            priceRange: '₹900 - ₹3,000 per plate',
            images: [
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.7,
            numReviews: 38,
            isVerified: true,
            contactEmail: 'orders@tastytreats.com',
            contactPhone: '9112233445',
        });

        const vendor15 = await User.create({
            name: 'Lakshmi Iyer',
            email: 'lakshmi@southspice.com',
            password: 'password123',
            role: 'vendor',
        });

        const profile15 = await VendorProfile.create({
            user: vendor15._id,
            businessName: 'South Spice Caterers',
            city: 'Bangalore',
            category: 'Caterer',
            description: 'Authentic South Indian wedding catering. Traditional banana leaf meals and modern fusion menus available.',
            priceRange: '₹700 - ₹2,000 per plate',
            images: [
                'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            rating: 4.6,
            numReviews: 27,
            isVerified: true,
            contactEmail: 'info@southspice.com',
            contactPhone: '9445566778',
        });

        // Create Services
        await Service.create({
            vendor: profile1._id,
            name: 'Pre-Wedding Shoot',
            description: 'Outdoor shoot at 2 locations.',
            price: 30000,
            category: 'Photography',
        });

        await Service.create({
            vendor: profile1._id,
            name: 'Wedding Day Package',
            description: 'Full day coverage with 2 photographers + 1 videographer.',
            price: 150000,
            category: 'Photography',
        });

        await Service.create({
            vendor: profile2._id,
            name: 'Gold Hall Rental',
            description: 'AC Hall with 500 seating capacity.',
            price: 200000,
            category: 'Venue',
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
