import Booking from "../models/bookingModel.js";
import Service from "../models/serviceModel.js";
import { StatusCodes } from "http-status-codes";

// Seeker creates a new booking
export const createBooking = async (req, res) => {
  try {
    const { serviceId, note } = req.body;

    // Validate
    if (!serviceId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Service ID is required" });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Service not found" });
    }

    // Prevent booking own service
    if (service.provider.toString() === req.user._id.toString()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "You cannot book your own service" });
    }

    // Create booking
    const booking = await Booking.create({
      service: service._id,
      provider: service.provider,
      seeker: req.user._id,
      note,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};

//  Provider views bookings for them
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("service", "title category")
      .populate("seeker", "name email phone");

    res.status(StatusCodes.OK).json({
      message: "Provider bookings fetched successfully",
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error in getProviderBookings:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};

//  Seeker views their bookings
export const getSeekerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ seeker: req.user._id })
      .populate("service", "title category")
      .populate("provider", "name email phone");

    res.status(StatusCodes.OK).json({
      message: "Seeker bookings fetched successfully",
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error in getSeekerBookings:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};

//  Provider updates booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Booking not found" });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.status(StatusCodes.OK).json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};
