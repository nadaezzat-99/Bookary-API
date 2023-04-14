const Users = require('../DB/models/user');
const Books = require('../DB/models/book');

const UserBooks = require('../DB/models/userBooks');
import { ObjectId } from 'mongoose';
import { AppError, trimText } from '../lib/index';

const getUserBooks = async (user: ObjectId, options: { page: number; limit: number }) => {
  const pageSize = options.limit ? options.limit : 10;
  const pageNumber = options.page ? options.page : 1;
  const totalDocs = (await UserBooks.find({ user: user })).length;
  const totalPages = Math.floor(totalDocs / pageSize);
  const docs = await UserBooks.find({ user: user })
    .populate({
      path: 'book',
      select: 'name bookImage authorId averageRating',
      populate: {
        path: 'authorId',
        select: 'fullName',
      },
    }).select('-_id -user ')
    .skip((pageNumber-1) * pageSize)
    .limit(pageSize);
  return { docs , totalDocs, totalPages };
};


const updateTotalRating = async (bookId: number, rating: number, previousRating: number) => {
  const book = await Books.findById(bookId);
  if (previousRating) {
    book.totalRating = book.totalRating - (previousRating * previousRating) + (Number(rating)* Number(rating));
  } else {
    book.totalRating = book.totalRating + (Number(rating)* Number(rating));
    book.ratingsNumber++;
  }
  book.save();
};

const updateUserBooks = async (data: { userId: string; bookId: number; shelf: string; rating?: number; review?: string;}) => {
  const book = await Books.findById(data.bookId);
  if (!book) throw new AppError(" Book doesn't exist ", 422);
  let previousRating = 0;
  const filter = { user: data.userId, 'book': data.bookId };
  if (data.review) data.review = trimText(data.review);  
  const newBookUpdate = {
    $set: {
      'shelf': data.shelf,
      'rating': data.rating,
      'review': data.review,
    },
  };

  const options = { upsert: true, rawResult: true };

  const updatedBook = await UserBooks.findOneAndUpdate(filter, newBookUpdate, options);
  let message = ` one Book updated successfully`;
  if (updatedBook.lastErrorObject.updatedExisting) {
    message = 'new Book Added to shelf';
    previousRating = updatedBook.value.book.rating;
  }

  if (data.rating) updateTotalRating(data.bookId, data.rating, previousRating);
  return { message };
};

module.exports = {
  getUserBooks,
  updateUserBooks,
};