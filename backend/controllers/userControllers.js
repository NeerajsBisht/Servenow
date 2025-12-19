import User from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {StatusCodes } from 'http-status-codes';

export const registerUser = async (req, res)=>{
    try{
        const {name, username, email, phone, password, gender, role}= req.body;

        //simple validation 
        if(!name || !username || !email || !phone || !password || !gender ||!role){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message:"All fields are required"
            });
        }

        //check for role
        if(!["provider", "seeker"].includes(role)){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message:"Role must be either 'provider' or 'seeker'",
            });
        }

        //check if email allready exists
        const existingUser= await User.findOne({email});
        if (existingUser){
            return res.status(StatusCodes.CONFLICT).json({
                message: "Email already registered"
            });
        }

        //check if usename already exists
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(StatusCodes.CONFLICT).json({
                message:"username already taken"
            });
        } 

        const newUser = await User.create({name, username, email, phone, password, gender,role});
        res.status(StatusCodes.CREATED).json({
            message: "User registered successfully",
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                gender: newUser.gender,
                role: newUser.role,
            },
        });
    }catch(error){
        console.error("eror in registerUser", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "server error",
            error: error.message,
        });
    }
};

//new login controller
export const loginUser = async(req, res)=>{
    try{
        const {emailOrUsername, password} = req.body;

        //validate input
        if(!emailOrUsername || !password ){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Email/Username and password are required",
            });
        }

        //check user by eamil or username
        const user = await User.findOne({
            $or: [{ email: emailOrUsername}, { username: emailOrUsername}],
        })
        
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found",
            });
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid credentials"
            });
        }

        //generate token
        const token = jwt.sign(
            {id:user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        //respond to success
        res.status(StatusCodes.OK).json({
            message: "login successful",
            token,
            user:{
                id: user._id,
                name:user.name,
                email:user.email,
                username: user.username,
                role:user.role,
            },
        });
    }catch(error){
        console.error("Error in loginUser", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Server error",
            error: error.message,
        });
    }
};

