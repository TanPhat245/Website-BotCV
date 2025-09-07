import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
    mongoose.connection.on('connected', () => 
        console.log('Đã kết nối đến MongoDB')
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`,)
}
export default connectDB;