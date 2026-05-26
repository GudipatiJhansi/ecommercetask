import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommercedb';
    console.log(`Connecting to database at ${connStr.replace(/:([^:@]+)@/, ':****@')}...`);
    
    const conn = await mongoose.connect(connStr);
    
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Failure: ${error.message}`);
    console.error('Please ensure MongoDB is running locally (e.g. standard local URI "mongodb://127.0.0.1:27017/ecommercedb") or check your Atlas credentials.');
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
