import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://andressanchez447:jbvXmn9QWK3DDiOS@cluster0.6u1ge.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};
