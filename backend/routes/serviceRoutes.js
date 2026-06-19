import express from 'express';
import { addService, getAllServices, getServicesByCategory, getServiceById } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import Service from '../models/serviceModel.js';
const router = express.Router();

//provider adds new service 
router.post("/", protect, authorizeRoles("provider"), addService);


router.get("/provider", protect, authorizeRoles("provider"), async (req, res) => {
  const services = await Service.find({ provider: req.user._id });
  res.json({ services });
});


//seeker can view all services
router.get("/", getAllServices);

//seeker filters by category(like /api/service/medical)
router.get("/category/:category", getServicesByCategory);

//seeker can search by id (like /api/service/12345)
router.get("/:id", getServiceById);


export default router;