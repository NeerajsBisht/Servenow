import User from "../models/userModels.js";

// GET all providers (role = provider)
export const listProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" }).select("-password");
    res.json({ providers });
  } catch (err) {
    console.error("Error fetching providers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET provider by ID
export const getProviderById = async (req, res) => {
  try {
    const provider = await User.findById(req.params.id).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json({ provider });
  } catch (err) {
    console.error("Error fetching provider:", err);
    res.status(500).json({ message: "Server error" });
  }
};
