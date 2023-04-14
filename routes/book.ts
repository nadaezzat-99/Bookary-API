import express, { Request, Response, Router, NextFunction } from 'express';
import { AppError, asycnWrapper} from '../lib';
const { booksController } = require('../controllers/index');
const { validate } = require('../middlewares/validation');
const { booksValidator, paginationOptions } = require('../Validations');

const router: Router = express.Router();

router.get('/', validate(paginationOptions) ,async (req: Request, res: Response, next: NextFunction) => {
const { page, limit } = req.query;
const book = booksController.getBooks_fullInfo({page, limit });
const [err, data] = await asycnWrapper(book);
if (err) return next(err);
res.status(200).json({ success: true, data , result: data.totalDocs });
});


router.get('/popular', async (req: Request, res: Response, next: NextFunction) => {
const book = booksController.getPopularBooks(req.params.id);
const [err, data] = await asycnWrapper(book);
if (err) return next(err);
res.status(200).json({ success: true, data });
});


router.get('/:id',  validate(booksValidator.bookId), async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);
const book = booksController.getBookById_fullInfo(req.params.id);
const [err, data] = await asycnWrapper(book);
if (err) return next(err);
if (!data) return next(new AppError (`No book with ID ${req.params.id}`, 400)); 
res.status(200).json({ success: true, data });
});


module.exports = router;
