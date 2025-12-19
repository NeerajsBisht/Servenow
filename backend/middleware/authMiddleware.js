import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/userModels.js';

export const protect = async(req, res, next)=>{
    let token;

    //check for token in the header
    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try{
            //extract token from header
            token = req.headers.authorization.split(" ")[1];

            //verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //fetch the user (excluding password)
            req.user = await User.findById(decoded.id).select("-password");
            next();  //proceed to next middleware
        }catch(error){
            console.error("token verification failed", error);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "not authorized, invalid token"
            });
        }
    }   
    if (!token){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message:"not authorized, no token"
        });
    }    
};