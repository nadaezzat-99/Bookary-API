import mongoose, { Document, Model, ObjectId, Types } from 'mongoose';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

enum Shelf {
  READ = 'read',
  READING = 'reading',
  WANT2READ = 'want2read',
}

enum Entities {
  AUTHORS = 0,
  BOOKS = 1,
  CATEGORIIES = 2,
}

type review = {
  comment: String;
  user: Types.ObjectId;
  rating: Number;
};

interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName: string;
  pImage?: string;
  role: Role;
}
interface Book extends Document {
  _id: number;
  name: string;
  bookImage: string;
  categoryId: number;
  authorId: number;
  totalRating: number;
  ratingsNumber: number;
  description?: string;
}

interface PaginatedBooks {
  docs: Book[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}

interface Category extends Document {
  _id: number;
  name: string;
}

interface PaginatedCategories {
  docs: Category[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}

interface counter extends Document {
  _id: number;
  count: number;
}

interface BookModel extends Model<Book> {
  getNewId: () => Promise<number>;
}

interface categoryModel extends Model<Category> {
  getNewId: () => Promise<number>;
}
interface counterModel extends Model<counter> {}

interface Counter {
  id: String;
  seq: Number;
}
interface Author {
  _id: Number;
  authorImg?: string;
  firstName: string;
  lastName: string;
  history: string;
  DOB: Date;
  bio: string;
}


interface Author {
  _id: Number;
  authorImg?: string;
  firstName: string;
  lastName: string;
  history: string;
  DOB: Date;
  bio: string;
}

interface AuthorModel extends Model<Author> {
  getNewId: () => Promise<number>;
}
// Here
interface UserBooks {
  populate: (options: any) => any;
  books: {
    book: {
      _id: string;
      name: string;
      bookImage: string;
      authorId: {
        firstName: string;
        lastName: string;
      };
      ratingsNumber: number;
      averageRating: number;
    };
  }[];
}
interface BookData {
  bookId: number;
  shelf: Shelf;
  rating?: number;
  review?: string;
}

interface UserBookDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  books: Record<number, BookData>;
}

export {
  User,
  Role,
  Entities,
  Counter,
  Author,
  AuthorModel,
  categoryModel,
  PaginatedBooks,
  BookModel,
  Shelf,
  counterModel,
  Category,
  Book,
  PaginatedCategories,
  review,
  UserBooks,
  BookData,
  UserBookDocument,
};
