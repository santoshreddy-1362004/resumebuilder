import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//generate a token jwt

const generateToken =(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET, {expiresIn: '30d'})
}

export const registerUser = async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        //check if user already exists
        const userExists= await User.findOne({email})
        if(userExists){
            return res.status(400).json({message: 'User already exists'});
        }
        if(password.length < 8){
            return res.status(400).json({success:false, message: 'Password must be at least 8 characters long'});
        }
        // hashing password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create user
        const user =await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)

        })
    }
    catch(error){
        res.status(500).json({
            message:"server error",
            error: error.message
        })
    }
}
//Login function
export const loginUser= async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email})
        if(!user){
           return res.status(401).json({message:'invalid email or password'})
        }
        //compare password
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:'invalid email or password'})
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    catch(error){
        res.status(500).json({
            message:"server error",
            error: error.message
        })
    }
}
//get user profile
export const getUserProfile = async(req,res)=>{
    try{
        const user=await User.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user);


    }
       catch(error){
        res.status(500).json({
            message:"server error",
            error: error.message
        })
    }

}