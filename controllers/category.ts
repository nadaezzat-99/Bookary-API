import { ObjectId } from 'mongoose';
import { Category, PaginatedCategories ,PaginatedBooks } from '../DB/schemaInterfaces';
import { AppError } from '../lib';

const Categories = require('../DB/models/category');
const Books = require('../DB/models/book');


const create = (data: Category) => Categories.create(data);

const getCategories = () => Categories.find({}).select('-createdAt -updatedAt -__v');

const getPaginatedCategories = async (options: { page: number; limit: number }): Promise<PaginatedCategories> => {
  if (!options.limit) options.limit = 10;
  if (!options.page) options.page = 1;
  const result = (await Categories.paginate({}, options)) as PaginatedCategories;
  return result as PaginatedCategories;
};

const editCategory = (data: { id: number; name: string }) =>
  Categories.findByIdAndUpdate(data.id, { name: data.name }, { new: true });

const deleteCategory = (id: ObjectId) => Categories.findByIdAndDelete(id);

const getCategoyBooks = async (id: number, options: { page: number; limit: number }) => {
  const category = await Categories.findById(id);
  if (!category) throw new AppError(`No book with ID ${id}`, 400);   
  if(!options.limit) options.limit = 10;
  if (!options.page) options.page = 1;
  const categoryBooks = await  Books.paginate({ categoryId: id }, {...options , populate: 'authorId'}) as PaginatedBooks;
  return categoryBooks as PaginatedBooks;
};

module.exports = {
  create,
  getCategories,
  getPaginatedCategories,
  editCategory,
  deleteCategory,
  getCategoyBooks,
};
