
import express, {Request, Response , Router,NextFunction} from 'express';
import { AppError, asycnWrapper } from '../lib/index';
const { authorController } = require("../controllers/index")
const router : Router = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { authorValidator } = require('../Validations');
 const Authors = require('../DB/models/author')


router.get('/popular', async (req: Request, res: Response, next: NextFunction) => {
  const author = authorController.getPopularAuthors();
  const [err, data] = await asycnWrapper(author);
  if (err) return next(err);
  res.status(200).json({success: true , data});
});

// what is this?
router.get('/:id', userAuth, validate(authorValidator.checkvalidID), async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id }} = req;
    const { query: { page, limit }} = req;
    const author = await Authors.findOne({ _id: id }).select('firstName lastName authorImg bio').lean();
    const authorBooks = authorController.authorBooks(id, page, limit);
    let [err, data] = await asycnWrapper(authorBooks);
    if (err) return next(err);
    if (!data) return next( new AppError (`No Author with ID ${id}`, 400)); 
    res.status(200).send({author, data ,result: data.totalDocs});
  });
 
module.exports = router;