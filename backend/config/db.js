import mongoose from 'mongoose';

export const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://santosh1362004:resume1234@cluster0.wlo6xch.mongodb.net/resumebuilder')
    .then(() => console.log('MongoDB connected successfully'))
    
}