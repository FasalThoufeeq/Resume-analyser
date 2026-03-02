import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.warn("⚠️ MONGODB_URI not provided. Skipping database connection for now.");
            return;
        }
        await mongoose.connect(uri);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error("Database connection error:", err.message);
        // Do not exit process, let the app run without DB initially
    }
};

export default connectDB;
