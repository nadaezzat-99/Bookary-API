
import express, {Request, Response , Router,NextFunction} from 'express';
import { AppError, asycnWrapper } from '../lib/index';
const {upload} = require("../middlewares/imageMiddleware")
const { authorController } = require("../controllers/index")
const { adminAuth } = require('../middlewares/auth');
const { Counter } = require("../DB/models/index")
const { validate } = require('../middlewares/validation');
const { authorValidator,paginationOptions } = require('../Validations');

const router : Router = express.Router();

router.use(adminAuth)
router.post('/', upload.single("authorImg"),validate(authorValidator.validateAuthor),async (req:Request, res:Response, next:NextFunction) => {
    const authorImg = req.file?.path
    const incrementalId = await Counter.findOneAndUpdate(
        {id:"authorInc"},
        { $inc: { seq: 1 } },
        { new: true}
      );
    let _id;    
    if(incrementalId == null) {
        Counter.create({id:"authorInc",seq:1})
        _id=1
    }else{
        _id = incrementalId.seq;
    }
    const { body:{ firstName, lastName, DOB , bio } } = req; 
    const author = authorController.createAuthor({ _id , firstName, lastName, DOB, bio});
    // const author = authorController.createAuthor({ _id , firstName, lastName, DOB, bio, authorImg});
    const [err, data] = await asycnWrapper(author);
    if(err) return next(err);
    res.status(200).json({message:"Author Added successfully"});
  });  

  router.patch(
    '/:id',
    upload.single("authorImg"),
    validate(authorValidator.checkvalidID),
    validate(authorValidator.validateAuthor),
    async (req:Request, res:Response, next:NextFunction) => {
      // const authorImg = req.file?.path
      const { params:{ id }} = req 
      const { body:{ firstName, lastName, bio, DOB } } = req; 
      // const author = authorController.updateAuthor(id,{  firstName, lastName, bio, DOB, authorImg});
      const author = authorController.updateAuthor(id,{  firstName, lastName, bio, DOB});
      let [err, data] = await asycnWrapper(author);
      if (err) return next(err);
      if (!data) return next(new AppError (`No Author with ID ${id}`, 400)); 
      res.status(200).json({message:"Author updated successfully"});
  });  


  router.get('/',validate(paginationOptions),async (req:Request, res:Response, next:NextFunction) => { 
      const { query:{ limit,page }} = req 
      const author = authorController.getAuthors({page,limit});
      const [err, data] = await asycnWrapper(author);
      if (err) return next(err);
      res.status(200).json(data);
  });  

  router.delete(
    '/:id',
    validate(authorValidator.checkvalidID),
    async (req:Request, res:Response, next:NextFunction) => { 
      const { params:{ id }} = req 
      const author = authorController.deleteAuthor(id);
      let [err, data] = await asycnWrapper(author);
      if (err) return next(err);
      if (!data) return next(new AppError (`No Author with ID ${id}`, 400)); 
      res.status(200).json({message:"Author deleted successfully"});
  });  

module.exports = router;