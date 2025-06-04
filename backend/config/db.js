// connect to the db throught this file.

// config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://gauravgupta:gaurav@cluster0.jttakaa.mongodb.net/food_website');
  console.log("DB connected by gaurav");
};
