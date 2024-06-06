import express from 'express'
import ImageProcessingController from "../controllers/ImageProcessingController"

const imageProcessingRouter = express.Router();

imageProcessingRouter.get("/", ImageProcessingController.getImage);

export default imageProcessingRouter
