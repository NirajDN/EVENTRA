const mongoose = require('mongoose');
require('dotenv').config();

const checkConnection = async () => {
    console.log('--- Database Connection Check ---');

    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('❌ Error: MONGO_URI environment variable is NOT defined.');
        process.exit(1);
    }

    console.log(`Checking connection to: ${uri.split('@')[1] || 'localhost'} (credentials hidden)`);

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Success: Connected to MongoDB!');
        console.log('Database Name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);

        await mongoose.connection.close();
        console.log('Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB.');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);

        if (error.message.includes('bad auth')) {
            console.error('👉 Hint: Check your username and password in the connection string.');
        } else if (error.message.includes('ETIMEDOUT') || error.message.includes('querySrv ETIMEOUT')) {
            console.error('👉 Hint: Check your IP Whitelist in MongoDB Atlas. Ensure 0.0.0.0/0 is added.');
        }

        process.exit(1);
    }
};

checkConnection();
