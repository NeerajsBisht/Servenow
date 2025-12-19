import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModels.js";

dotenv.config();

const providers = [
  // Tutor
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Riya Sharma",
    username: "riya_tutor",
    email: "riya.tutor@example.com",
    phone: 9876543201,
    gender: "female",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Tutoring",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Aman Gupta",
    username: "aman_math",
    email: "aman.math@example.com",
    phone: 9876543202,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Tutoring",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Shruti Verma",
    username: "shruti_english",
    email: "shruti.english@example.com",
    phone: 9876543203,
    gender: "female",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Tutoring",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Karan Singh",
    username: "karan_science",
    email: "karan.science@example.com",
    phone: 9876543204,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Tutoring",
    password: "Provider@123",
  },

  // Household
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Pooja Devi",
    username: "pooja_home",
    email: "pooja.household@example.com",
    phone: 9876543301,
    gender: "female",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Household",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Ramesh Kumar",
    username: "ramesh_cleaner",
    email: "ramesh.cleaning@example.com",
    phone: 9876543302,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Household",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Sarla Devi",
    username: "sarla_maid",
    email: "sarla.maid@example.com",
    phone: 9876543303,
    gender: "female",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Household",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Deepak Chauhan",
    username: "deepak_home",
    email: "deepak.household@example.com",
    phone: 9876543304,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Household",
    password: "Provider@123",
  },

  // Medical
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Dr. Meera Nair",
    username: "meera_medic",
    email: "meera.medical@example.com",
    phone: 9876543401,
    gender: "female",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Medical",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Sanjay Verma",
    username: "sanjay_health",
    email: "sanjay.health@example.com",
    phone: 9876543402,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Medical",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Nikita Rao",
    username: "nikita_nurse",
    email: "nikita.nurse@example.com",
    phone: 9876543403,
    gender: "female",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Medical",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Dr. Rahul Jain",
    username: "rahul_doctor",
    email: "rahul.doctor@example.com",
    phone: 9876543404,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Medical",
    password: "Provider@123",
  },

  // Vehicle
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Mohit Yadav",
    username: "mohit_carwash",
    email: "mohit.vehicle@example.com",
    phone: 9876543501,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Vehicle",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Vikas Chauhan",
    username: "vikas_driver",
    email: "vikas.driver@example.com",
    phone: 9876543502,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Vehicle",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Asha Tiwari",
    username: "asha_vehicle",
    email: "asha.vehicle@example.com",
    phone: 9876543503,
    gender: "female",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Vehicle",
    password: "Provider@123",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Rohit Mehra",
    username: "rohit_bike",
    email: "rohit.bike@example.com",
    phone: 9876543504,
    gender: "male",
    profileImage: "/images/default-user.png",
    role: "provider",
    category: "Vehicle",
    password: "Provider@123",
  }
];

const seedProviders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to MongoDB");

    await User.deleteMany({ role: "provider" });

    await User.insertMany(providers);

    console.log("Providers seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding providers:", err.message);
    process.exit(1);
  }
};

seedProviders();
