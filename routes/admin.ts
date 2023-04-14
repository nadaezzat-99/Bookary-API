import express, {Request, Response , Router,NextFunction} from 'express';
const { userController} = require("../controllers/index");
const { usersValidator } = require('../Validations');
const { validate } = require('../middlewares/validation');
const { adminAuth } = require('../middlewares/auth');
import { asycnWrapper } from '../lib/index';

const bookRoute = require("./admin_books");
const categoryRoute = require("./admin_category");
const authorRoute = require("./admin_authors");

const router : Router = express.Router();

router.use('/books', bookRoute);
router.use('/categories', categoryRoute);
router.use('/authors', authorRoute);

// router.post('/signin', validate(usersValidator.signIn), adminAuth,async (req:Request, res:Response, next:NextFunction) => {
//     const { body: { userName, password } } = req;
//       const token = userController.signIn({userName, password});
//       const [err, data] = await asycnWrapper(token);
//       if (err) return next(err);
//       // res.cookie('token',data, { httpOnly: true }).status(200).json({ token });
//       res.status(200).json({ token:data });
//   });

module.exports = router;