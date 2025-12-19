import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required:true,
            trim:true,
        },
        category:{
            type:String,
            required: true,
            enum:["Medical", "Tutoring", "Vehicle", "HouseHold", "Other"],
        },
        description:{
            type:String,
            required: true,
            trim: true,
        },
        location:{
            type: String,
            required: true,
        },
        price:{
            type:Number,
            required: true,
        },
        provider:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        providerName:{
            type:String,
            required: true,
        },
        providerPhone:{
            type: String,
            required: true,
        }
    },
    { timestamps:true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;