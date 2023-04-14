import express, { Application, NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { AppError } from './lib';
const { handleResponseError } = require('./lib/handlingErrors');
const app: Application = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');


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

app.use('/', routes.userRoute);
app.use('/admin', routes.adminRoute);
app.use('/books', routes.bookRoute);
app.use('/authors', routes.authorRoute);
app.use('/categories', routes.CategoryRoute);
app.use('/user', routes.userBooksRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleResponseError);

module.exports = app;
