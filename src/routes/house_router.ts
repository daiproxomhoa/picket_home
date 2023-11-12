import express from "express";
import multer from "multer";

import { fileFilter, storage } from "../config/multer";
import HouseController from "../controllers/house_controller"; // Import the controller
var houseRouter = express.Router();

const upload = multer({ storage: storage, fileFilter: fileFilter });

houseRouter.post(
  "/get_total_address",
  upload.single("file"),
  HouseController.getTotalAddress
);

export default houseRouter;
