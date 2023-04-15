
import express, {Request, Response , Router,NextFunction} from 'express';
import { AppError, asycnWrapper } from '../lib/index';
const { authorController } = require("../controllers/index")
const router : Router = express.Router();
const { validate } = require('../middlewares/validation');
const { authorValidator , paginationOptions } = require('../Validations');
 const Authors = require('../DB/models/author')


router.get('/popular', async (req: Request, res: Response, next: NextFunction) => {
  const author = authorController.getPopularAuthors();
  const [err, data] = await asycnWrapper(author);
  if (err) return next(err);
  res.status(200).json({success: true , data});
});

// get Author Books
router.get('/:id', validate(authorValidator.checkvalidID), validate(paginationOptions), async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id }} = req;
    const { query: { page, limit }} = req;
    const author = await Authors.findOne({ _id: id }).select('firstName lastName authorImg bio').lean();
    if (!author) return next( new AppError (`No Author with ID ${id}`, 400)); 
    const authorBooks = authorController.authorBooks(id, page, limit);
    let [err, data] = await asycnWrapper(authorBooks);
    if (err) return next(err);
    res.status(200).send({author, data ,result: data.totalDocs});
  });
 
module.exports = router;