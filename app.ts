import express, { Application } from 'express';
import { AppError } from './lib';

const { handleResponseError } = require('./lib/handlingErrors');
const app: Application = express();
const cors = require('cors');

const cookieParser = require("cookie-parser");
const routes = require('./routes/index.ts');
require('./DB/connects');

const corsOptions = {
  origin: "http://localhost:4200",
  credentials:true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleResponseError);

module.exports = app;
