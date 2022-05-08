import express from 'express';
import BookController from '../controller/bookController.js'
import AuthClient from '../middleware/auth.js'

const router = express.Router();
const bookController = new BookController();
const authClient = new AuthClient();

//[authClient.verifyToken, authClient.isUserOrAdmin]
router.get('/', bookController.getAll);

router.get('/:isbn', bookController.getBook);

router.get('/genre/:genre', bookController.getBooksByGenre);

router.post('/', bookController.createBook)

router.put("/:isbn", bookController.updateBook)

router.delete('/:isbn', bookController.deleteBook)


export {router};
