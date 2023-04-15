import express, { Request, Response, Router, NextFunction } from 'express';
import { asycnWrapper } from '../lib/index';

const adminRoute = require("./admin");
const bookRoute = require("./book");
const CategoryRoute = require("./category");
const authorRoute = require("./author");
const userBooksRoute = require("./userBooks");


const { userController } = require('../controllers/index');
const { upload } = require('../middlewares/imageMiddleware');
const { usersValidator } = require('../Validations');
const { validate } = require('../middlewares/validation');
const { authorController } = require('../controllers/index');


const router: Router = express.Router();

router.post('/register', upload.single('pImage'), validate(usersValidator.signUp), async (req: any, res: Response, next: NextFunction) => {
    const pImage = req.file?  req.file.path: undefined;
    const {
      body: { firstName, lastName, userName, email, password, role },
    } = req;
    const user = userController.create({ firstName, lastName, userName, email, password, pImage, role });
    const [err, data] = await asycnWrapper(user);
    if (err) return next(err);
    res.status(200).json({ message: 'User registered successfully', data });
  }
);


router.post('/signin', validate(usersValidator.signIn), async (req: Request, res: Response, next: NextFunction) => {  
  try {
    const { userName, password } = req.body;    
    const {token, user} = await userController.signIn({ userName, password });    
    res.cookie('access_token', token, { httpOnly: true})
      .status(200).json({ user })
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async(req:Request, res:Response) => {
  return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out" })});


// what is this?
router.get('/authors', async (req: Request, res: Response, next: NextFunction) => {
  const {
    query: { limit, page },
  } = req;
  const author = authorController.getAuthors({ page, limit });
  const [err, data] = await asycnWrapper(author);
  if (err) return next(err);
  res.status(200).json(data);
});


router.use("/admin", adminRoute);
router.use("/books", bookRoute);
router.use("/authors", authorRoute);
router.use("/categories", CategoryRoute);
router.use("/user", userBooksRoute);


module.exports = router;

