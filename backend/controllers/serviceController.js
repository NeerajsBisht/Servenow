import Service from '../models/serviceModel.js';
import { StatusCodes } from 'http-status-codes';

// Provider adds a new service
export const addService = async(req, res)=>{
    try{
        const{ title, category, description, location, price}= req.body;

        if(!title || !category || !description || !location || !price){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message:"All fields are required"
            });
        }
        const service= await Service.create({
            title, 
            category, 
            description, 
            location, 
            price, 
            provider:req.user._id, 
            providerName: req.user.name,
            providerPhone: req.user.phone,
        });
        res.status(StatusCodes.CREATED).json({
            message:"Service added successfully",
            service,
        });
    }catch(error){
        console.error("Error in addService", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Server error", error:error.message
        });
    }
};

//seeker fetches all available services
export const getAllServices = async (req, res)=>{
    try{
        const services = await Service.find().populate("provider", "name email gender role");
        res.status(StatusCodes.OK).json({
            message: "All services fetched seccessfully",
            total: services.length,
            services,
        });
    }catch(error){
        console.error("Error in getAllServices:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Server error", error: error.message
        });
    }
};

//Get services by category ( for filtering)
export const getServicesByCategory = async (req, res)=>{
    try{
        const { category } = req.params;
        const services = await Service.find({ category }).populate("provider", "name email phone gender");

        if(services.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "No services found for this category"
            });
        }
        res.status(StatusCodes.OK).json({
            message : `Services in ${category} category fetched successfully`,
            total: services.length,
            services,
        });
    }catch(error){
        console.error("Error in getServiceBy Category", error);
        res.ststus(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error", error: error.message
        });
    }
};
