import { Request, Response, NextFunction } from 'express';
import { Role } from '../DB/schemaInterfaces';
import { AppError } from '../lib/index';

const jwt = require('jsonwebtoken');
const Users = require('../DB/models/user');


const verifyToken = async (token: string) => {
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const user = await Users.findOne({ userName:decoded.userName});
  if(!user) throw new AppError('un-authenticated',401); 
  return user;
};

const checkAuth= async (token:string, selectedRole:Role) => {
  if (!token) throw new AppError('un-authenticated',401); 
  const result = await verifyToken(token);
  if (result.role !== selectedRole) throw new AppError('Unauthorized-User',403);
  return result;
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.user = checkAuth( req.cookies.access_token, Role.USER)
    next();
  } catch (err) {
    next(err);
  }
};

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.user = checkAuth( req.cookies.access_token, Role.ADMIN)
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { userAuth, adminAuth };
