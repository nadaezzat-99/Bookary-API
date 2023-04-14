import { File } from "buffer";
import { Request } from "express";

const multer = require('multer');
const BaseError = require('./baseError');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const createPhotoURL = async (url: string) => {
  let photo = await cloudinary.uploader
    .upload(url, {
      resource_type: 'image',
    })
    .then((result: { secure_url: string }) => {
      fs.unlinkSync(url);
      return result.secure_url;
    })
    .catch((err: Error) => {
      console.log(err);
    });
  return photo;
};


