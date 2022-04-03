import express from 'express';
import GenreController from '../controller/genreController.js'
import AuthClient from '../middleware/auth.js'

const router = express.Router();
const genreController = new GenreController();
const authClient = new AuthClient();

router.get('/', genreController.getAll);

router.get('/:name', genreController.getGenre);

router.post('/', genreController.createGenre)

router.delete('/:name', genreController.deleteGenre)


export {router};
