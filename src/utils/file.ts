import path from 'path';

export const getOutputFilePath = (filename: string) => {
  return path.join(process.cwd(), 'images', 'results', `${filename}.jpg`);
};

export const getInputFilePath = (filename: string) => {
  return path.join(process.cwd(), 'images', `${filename}.jpg`);
};
