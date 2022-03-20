import express from 'express';
import UserController from '../controller/userController.js';
import AuthClient from '../middleware/auth.js'

const router = express.Router();
const userController = new UserController();
const authClient = new AuthClient();

router.get('/', userController.getAll);

router.get('/:username', userController.getPerson);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/books', userController.handleBookActions);

export {router};