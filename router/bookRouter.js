import express from 'express';
import BookController from '../controller/bookController.js'
import AuthClient from '../middleware/auth.js'

const router = express.Router();
const bookController = new BookController();
const authClient = new AuthClient();

router.get('/',[authClient.verifyToken, authClient.isUser], bookController.getAll);

router.get('/:isbn', bookController.getBook);

router.post('/', bookController.createBook)

router.delete('/:isbn', bookController.deleteBook)


export {router};
