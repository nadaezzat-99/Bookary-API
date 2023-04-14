import express, { Request, Response,NextFunction } from 'express';
import { AppError } from '../lib/appError';
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: async (req:any, file:any) => {
      switch (file.fieldname) {
        case 'pImage':
          return 'profile-imgs';
        case 'authorImg':
          return 'author-imgs';
        case 'bookImage':
          return 'books-imgs';
        default:
          return `random-imgs`;
      }
    },
    allowedFormats: ['jpg', 'jpeg', 'png'],

    public_id: async (req:any, file:any) => {
      const myFileName = `${Date.now()}-${file.originalname}`;
      return myFileName;
    },
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 0.25, // 250KB
  },
  fileFilter: function (req: any, file: any, cb: any) {
    console.log(file);    
    try {
      const ext = path.extname(file.originalname);
      if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
        return cb(new AppError('Only images are allowed', 400));
      }
      cb(null, true);
    } catch (e) {
      return cb(true, null);
    }
  },
});





export { upload };
