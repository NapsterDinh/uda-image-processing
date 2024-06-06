// import fs from 'fs'
// import supertest from 'supertest';
// import server from '../index'
// import service from '../services/SharpService'

import { getInputFilePath, getOutputFilePath } from '../utils/file';
import supertest from 'supertest';
import fs from 'fs';
import server from '../index';
import service from '../services/SharpService';

const { resize } = service;

const requestServer = supertest(server);

describe('GET /resize-image', () => {
  it('should return error unless pass filename parameter', (done) => {
    requestServer
      .get('/api/v1/images')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done();
        expect(res.body).toEqual({
          status: 'failed',
          data: null,
          message: 'filename is required',
        });
        done();
      });
  });

  it('should return error unless filename does not exist', (done) => {
    requestServer
      .get(`/api/v1/images?width=200&filename=${'fjord222'}&height=401`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done();
        expect(res.body).toEqual({
          status: 'failed',
          data: null,
          message: 'filename is not exist',
        });
        done();
      });
  });
  it('should get file success', async () => {
    const response = await requestServer.get('/api/v1/images?width=200&filename=fjord&height=401');

    expect(response.status).toBe(200);
  });

  it('should get file success without width parameter', async () => {
    const response = await requestServer.get('/api/v1/images?filename=fjord&height=401');

    expect(response.status).toBe(200);
  });
  it('should get file success without height parameter', async () => {
    const response = await requestServer.get('/api/v1/images?width=200&filename=fjord');

    expect(response.status).toBe(200);
  });
});

describe('resizeImage function', () => {
  it('wrong filename', async () => {
    const filenameTest = 'santamonica1',
      widthTest = 100,
      heightTest = 100;
    spyOn(console, 'log');
    const inputPath = getInputFilePath(filenameTest);
    await resize({ filename: filenameTest, width: widthTest, height: heightTest });
    expect(console.log).toHaveBeenCalledOnceWith(`${inputPath} is not exist!!`);
  });

  it('output file is correctly', async () => {
    const filenameTest = 'santamonica',
      widthTest = 100,
      heightTest = 100;
    const outputFilePath = await resize({ filename: filenameTest, width: widthTest, height: heightTest });

    expect(outputFilePath).toBe(getOutputFilePath(`${filenameTest}-${widthTest}-${heightTest}`));
  });

  it("resize image without parameter 'width'", async () => {
    const filenameTest = 'santamonica',
      heightTest = 100;
    const outputFilePath = await resize({ filename: filenameTest, height: heightTest });

    expect(outputFilePath).toBe(getOutputFilePath(`${filenameTest}-${200}-${heightTest}`));
  });

  it("resize image without parameter 'height'", async () => {
    const filenameTest = 'santamonica',
      widthTest = 100;
    const outputFilePath = await resize({ filename: filenameTest, width: widthTest });

    expect(outputFilePath).toBe(getOutputFilePath(`${filenameTest}-${widthTest}-${200}`));
  });

  it("resize image without parameter 'width' and 'height'", async () => {
    const filenameTest = 'santamonica';
    const outputFilePath = await resize({ filename: filenameTest });

    expect(outputFilePath).toBe(getOutputFilePath(`${filenameTest}-${200}-${200}`));
  });

  it('resized image need be created and stored correctly', async () => {
    const filenameTest = 'santamonica',
      widthTest = 100,
      heightTest = 100;
    const outputFilePath = await resize({ filename: filenameTest, width: widthTest, height: heightTest });
    expect(fs.existsSync(outputFilePath)).toBe(true);
  });

  it('use cache resized image instead of creating new image with the same width and height', async () => {
    const filenameTest = 'fjord',
      widthTest = 200,
      heightTest = 200;
    spyOn(console, 'log');
    const outputFilePath = await resize({ filename: filenameTest, width: widthTest, height: heightTest });
    expect(console.log).toHaveBeenCalledOnceWith(`${outputFilePath} is exist!!`);
  });
});
