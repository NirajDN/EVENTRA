# Eventra

A comprehensive wedding vendor platform built with Next.js and Node.js.
<img width="1440" height="808" alt="Screenshot 2025-12-04 at 3 45 24 PM" src="https://github.com/user-attachments/assets/005373a1-46c4-4b32-ab86-05be5ff389b3" />



## Features

- 🔍 Search and filter wedding vendors by category and city
- 👤 User authentication (Customer, Vendor, Admin roles)
- 📸 Image uploads with Cloudinary
- 💬 Real-time chat between customers and vendors
- ⭐ Reviews and ratings system
- 📅 Booking management
- 🎨 Dark mode support
- 🤖 AI wedding assistant chatbot
- 📱 Fully responsive design

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TailwindCSS 4
- Framer Motion
- Socket.io Client

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Cloudinary for image storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/eventra.git
cd eventra
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Setup environment variables:

**Backend** - Create `backend/.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5001
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

5. Seed the database (optional):
```bash
cd backend
node seeder.js
```

6. Run the development servers:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
eventra/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── constants/
│   └── package.json
└── README.md
```

## Default Credentials (After Seeding)

**Admin:**
- Email: admin@example.com
- Password: password123

**Vendor:**
- Email: rahul@photography.com
- Password: password123

**Customer:**
- Email: amit@example.com
- Password: password123

## Features Overview

### For Customers
- Browse and search vendors by category and location
- View detailed vendor profiles with images and reviews
- Book vendors for events
- Chat with vendors in real-time
- Leave reviews and ratings
- Manage bookings from dashboard

### For Vendors
- Create and manage business profile
- Upload portfolio images
- Add services with pricing
- Manage booking requests
- Chat with customers
- Update profile information

### For Admins
- Manage all users
- Verify vendor accounts
- View and manage all bookings
- Monitor platform activity

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Support

For support, email your-email@example.com or create an issue in the repository.

---

Made with ❤️ for couples planning their dream wedding
