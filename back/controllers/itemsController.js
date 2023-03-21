// import model
import Items from "../models/Items.js";

// get All Items
export const getItems = async (req, res) => {
  try {
    const items = await Items.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
