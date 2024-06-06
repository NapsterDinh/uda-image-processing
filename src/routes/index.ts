import express from 'express'
import ImageProcessingRoutes from "./ImageProcessingRoute"

const router = express.Router();

router.use("/images", ImageProcessingRoutes);

export default router
