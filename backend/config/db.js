import mongoose from 'mongoose';
import chalk from 'chalk'

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(chalk.bgBlue("--------------------Database connected-------------------"));
        
    }catch(err){
        console.error("connection failed",err.message);
        process.exit(1);
    }
};

export default connectDB;