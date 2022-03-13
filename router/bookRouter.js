import express from 'express';
import BookController from '../controller/bookController.js'

const router = express.Router();
const bookController = new BookController();

router.get('/', bookController.getAll);

router.get('/:isbn', bookController.getBook);

router.post('/', bookController.createBook)

router.delete('/:isbn', bookController.deleteBook)


export {router};
