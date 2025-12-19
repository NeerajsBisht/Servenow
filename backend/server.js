import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import connectDB from "./config/db.js";

// ROUTES
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["content-type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// USER ROUTES
app.use("/api/users", userRoutes);

// SERVICE ROUTES
app.use("/api/services", serviceRoutes);

// BOOKING ROUTES
app.use("/api/bookings", bookingRoutes);

// PROVIDER ROUTES
app.use("/api/providers", providerRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "backend is running" });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Server error" });
});

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
