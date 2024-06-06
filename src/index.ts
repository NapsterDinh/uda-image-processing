import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import globalErrHandler from './controllers/ErrorController'
import AppError from './utils/appError'

const app: Express = express();

dotenv.config()
const port = process.env.PORT

// Allow Cross-Origin requests
app.use(cors());

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "15kb",
  })
);

// Routes
app.use("/api/v1", routes);

// handle undefined Routes
app.use("*", (req, res, next) => {
  console.log(req.originalUrl);
  const err = new AppError("404", "fail", "undefined route");
  next(err);
});

app.use(globalErrHandler);

app.listen(port, function () {
  console.log("Your app running on port " + port);
});

export default app

module.exports = app