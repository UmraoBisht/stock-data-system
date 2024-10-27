// routes/stockRoutes.js
import express from "express";
const router = express.Router();

import {
  uploadStockData,
  getHighestVolume,
  getAverageClose,
  getAverageVWAP,
} from "../controllers/stockController.js";
import upload from "../middlewares/multer.js";

// Upload CSV
router.post("/upload", upload.single("file"), uploadStockData);

// Data retrieval APIs
router.get("/highest_volume", getHighestVolume);
router.get("/average_close", getAverageClose);
router.get("/average_vwap", getAverageVWAP);
router.all("*",(_,res)=>{
  return res.status(404).json({ message: "Not found!" });
})

export default router;
