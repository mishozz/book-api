import express from 'express';
import UserController from '../controller/userController.js';
import AuthClient from '../middleware/auth.js'

const router = express.Router();
const userController = new UserController();
const authClient = new AuthClient();

router.get('/', userController.getAll);

router.get('/takenbooks',[authClient.verifyToken, authClient.isUserOrAdmin], userController.getTakenBooks);

router.get('/:email', userController.getPerson);

router.post('/register', userController.register);

router.post('/token', [authClient.verifyToken, authClient.isUserOrAdmin], userController.refreshToken)

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.post('/books', [authClient.verifyToken, authClient.isUserOrAdmin], userController.handleBookActions);

export {router};