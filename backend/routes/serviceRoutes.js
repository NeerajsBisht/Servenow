import express from 'express';
import { addService, getAllServices, getServicesByCategory } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

//provider adds new service 
router.post("/", protect, authorizeRoles("provider"), addService);

//seeker can view all services
router.get("/", getAllServices);

//seeker filters by category(like /api/service/medical)
router.get("/:category", getServicesByCategory);

router.get("/provider", protect, authorizeRoles("provider"), async (req, res) => {
  const services = await Service.find({ provider: req.user._id });
  res.json({ services });
});


export default router;