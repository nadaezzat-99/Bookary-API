import { Schema, model } from 'mongoose';
const validator = require('validator');
import { Author } from '../schemaInterfaces';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AppError } from '../../lib';
const Books = require('./book');


const schema = new Schema<Author>(
  {
    _id: {
      type: Number,
      required: [true, 'id is a required field'],
    },
    firstName: {
      type: String,
      minLength: [3, 'First name must be at least 3 characters'],
      maxLength: [15, 'First name must be at less than 15 characters'],
      required: [true, 'First name is a required field'],
      trim: true,
    },
    lastName: {
      type: String,
      minLength: [3, 'Last name must be at least 3 characters'],
      maxLength: [15, 'Last must be at less than 15 characters'],
      required: [true, 'Last name is a required field'],
      trim: true,
    },
    DOB: {
      type: Date,
      required: [true, 'Date of Birth is a required field'],
      validate(value: Date) {
        if (validator.isDate(value)) {
          if (new Date(value).getFullYear() > 2010) {
            throw new Error('Date of birth is invalid, Author Birth date year must be less than or equal 2010');
          }
        }
      },
    },
    bio: {
      type: String,
      default: 'No description',
    },
    authorImg: {
      type: String,
      default: 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png',
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.methods.toJSON = function () {
  const author = this;
  const authorObject = author.toObject();
  delete authorObject.__v;
  return authorObject;
};

schema.plugin(mongoosePaginate);

schema.virtual('fullName').get(function () {
  return `${this.firstName}  ${this.lastName}`;
});


schema.pre('findOneAndDelete', async function preDelete(next) {
  const authorId = this.getQuery()['_id'];
  const authordata =  await Books.countDocuments({authorId:authorId});
  if (authordata > 0) {
      const err = new AppError("Can't delete author with associated books",409)
      next(err);
  } else {
      next();
  }
})

const Author = model('Authors', schema);
module.exports = Author;
