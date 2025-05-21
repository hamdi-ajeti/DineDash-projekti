import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://hamdi100junior:DbPass123@cluster0.keyc2.mongodb.net/dinedash-projekti').then(() => console.log("DB Connected"));
}