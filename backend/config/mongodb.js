import mongoose from "mongoose"
import asyncHandler from "express-async-handler"

const connectDB = asyncHandler(async () => {

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
})

export default connectDB