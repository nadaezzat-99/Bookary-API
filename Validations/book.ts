import Joi from 'joi';
import { Shelf } from '../DB/schemaInterfaces';
const bookData = {
  body: Joi.object().keys({
    name: Joi.string().trim().min(3).max(30).required(),
    authorId: Joi.number().required(),
    categoryId: Joi.number().required(),
    description: Joi.string().trim().min(30).max(200),
  }),
};

const bookId = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const bookEdit = {
  body: Joi.object().keys({
    name: Joi.string().trim().min(3).max(30),
    authorId: Joi.number(),
    categoryId: Joi.number(),
    description: Joi.string().trim().min(30).max(200),
  }).min(1)
};


const updateUserBook = {
  params: Joi.object().keys({
    bookId: Joi.number().required(),
  }),

  body: Joi.object()
    .keys({
      rating: Joi.number().min(1).max(5),
      review: Joi.string().trim().min(3).max(140),
      shelf: Joi.string().valid(Shelf.READ, Shelf.READING, Shelf.WANT2READ),
    })
    .min(1),
};

module.exports = {
  bookData,
  bookId,
  bookEdit,
  updateUserBook
};
