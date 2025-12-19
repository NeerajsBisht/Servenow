import express from "express";
import {
  createBooking,
  getProviderBookings,
  getSeekerBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Seeker creates booking
router.post("/", protect, authorizeRoles("seeker"), createBooking);

// Seeker views their bookings
router.get("/my", protect, authorizeRoles("seeker"), getSeekerBookings);

// Provider views bookings received
router.get("/provider", protect, authorizeRoles("provider"), getProviderBookings);

// Provider updates booking status
router.put("/:bookingId/status", protect, authorizeRoles("provider"), updateBookingStatus);

export default router;
