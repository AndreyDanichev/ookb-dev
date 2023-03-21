// import express
import express from "express";
// import controllers
import { getTypes } from "../controllers/typesController.js";
import { getItems } from "../controllers/itemsController.js";
import { createDocument } from "../controllers/documentsController.js";

// express router
const router = express.Router();

// get All Types
router.get("/types", getTypes);
// get All Items
router.get("/items", getItems);
// create Document
router.post("/create-request", createDocument);

// export router
export default router;
