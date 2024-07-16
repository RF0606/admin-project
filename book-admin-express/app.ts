import BookRouter from './routes/book';
import CategoryRouter from './routes/category';
import UserRouter from './routes/users';
import LoginRouter from './routes/login';
import { expressjwt } from 'express-jwt';

import express, { Request, Response, NextFunction } from 'express';
import { SCRET_KEY } from "./constant";
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

require('./model/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressjwt({secret: SCRET_KEY, algorithms: ['HS256'] }).unless({ 
  path: [ '/api/login' ],
}));

app.use('/api/books', BookRouter);
app.use('/api/categories', CategoryRouter);
app.use('/api/users', UserRouter);
app.use('/api/login', LoginRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.listen('3005', ()=> {
  console.log('server start at 3005');
})
module.exports = app;