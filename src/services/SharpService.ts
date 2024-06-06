import fs from 'fs';
import sharp from 'sharp';
import { getInputFilePath, getOutputFilePath } from '../utils/file';

export type IResizeProps = {
  filename: string;
  width?: any;
  height?: any;
};

export const resize = async ({ filename, width, height }: IResizeProps) => {
  try {
    const transformWidth = Number.isInteger(Number(width)) ? Number(width) : 200;
    const transformHeight = Number.isInteger(Number(height)) ? Number(height) : 200;

    const inputPath = getInputFilePath(filename);
    const outputPath = getOutputFilePath(`${filename}-${transformWidth}-${transformHeight}`);

    if (!fs.existsSync(inputPath)) {
      console.log(`${inputPath} is not exist!!`);
      return '';
    }

    if (!fs.existsSync(outputPath)) {
      await sharp(inputPath).resize(transformWidth, transformHeight, { fit: 'contain' }).toFile(outputPath);
    } else {
      console.log(`${outputPath} is exist!!`);
    }

    return outputPath;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export default {
  resize,
};
module.exports = {
  resize,
};
