import { Request, Response, NextFunction } from "express";
import { Role } from "../DB/schemaInterfaces";
import { AppError } from "../lib/index";

const jwt = require("jsonwebtoken");
const Users = require("../DB/models/user");

const verifyToken = async (bearerToken: string) => {
  bearerToken = bearerToken.split(" ")[1];
  if (!bearerToken) return new AppError("Sign in again", 401);
  const decoded = jwt.verify(bearerToken, process.env.TOKEN_KEY);
  const user = await Users.findById(decoded.userId);
  if (!user) return new AppError("un-authenticated", 401);
  return user;
};

const checkAuth = async (bearerToken: string | undefined, role: Role) => {
  if (!bearerToken) throw new Error("Un-Authenticated");
  const result = await verifyToken(bearerToken);
  if (result.role !== role) throw new AppError("Unauthorized-User", 403);
  return result;
};

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.user = checkAuth(req.headers.authorization, Role.USER);
    next();
  } catch (err) {
    next(err);
  }
};

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.user = checkAuth(req.headers.authorization, Role.ADMIN);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { userAuth, adminAuth };
