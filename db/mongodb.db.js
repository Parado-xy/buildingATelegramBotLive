import mongoose from "mongoose";
import { MONGODB_URI } from "../env.js";

// MongoDB connection configuration
const connectDB = async () => {
    try {
                console.log(MONGODB_URI)
        // Connect to MongoDB
        const conn = await mongoose.connect(MONGODB_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB');
        });
        
        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to application termination');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;

