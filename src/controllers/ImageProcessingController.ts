import { Request, Response, NextFunction } from "express";
import { resize } from '../services/SharpService'

const getImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filename, width, height } = req.query
        if (!filename) {
            res.status(400).json({
                status: "failed",
                data: null,
                message: "filename is required"
            })
            return
        }

        const outputImagePath = await resize({ filename: filename as string || '', width , height })
        if(!outputImagePath){
            res.status(400).json({
                status: "failed",
                data: null,
                message: "filename is not exist"
            })
            return
        }
        res.sendFile(outputImagePath)
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export default {
    getImage
}