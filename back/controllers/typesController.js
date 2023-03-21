// import model
import Types from "../models/Types.js";

// get All Types
export const getTypes = async (req, res) => {
  try {
    const types = await Types.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
