import { Request, Response, NextFunction } from 'express';
import { Role } from '../DB/schemaInterfaces';
import { AppError } from '../lib/index';

const jwt = require('jsonwebtoken');
const Users = require('../DB/models/user');


const verifyToken = async (token: string) => {
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  console.log(decoded);
  const user = await Users.findOne({ userName:decoded.userName});
  if(!user) throw new AppError('un-authenticated',401); 
  return user;
};

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  try {
    if (!token) throw new AppError('Unauthorized', 403);
    const result = await verifyToken(token);
    if (result.role !== Role.USER) throw new AppError('Unauthorized-User',403);
    req.user = result
    next();
  } catch (err) {
    next(err);
  }
};

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  try {
    if (!token) throw new AppError('Unauthenticated-User',401);
    const result = await verifyToken(token);
    console.log(result.role)
    if (result.role !== Role.ADMIN) throw new AppError('Unauthorized-User',403);
    req.user = result;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { userAuth, adminAuth };
