import express from 'express';
import bcrypt from 'bcrypt'
import Book from '../model/books.js'
import User from '../model/user.js'
import UserController from '../controller/userController.js';

const router = express.Router();
const userController = new UserController();

router.get('/', userController.getAll);

router.get('/:username', userController.getPerson);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/books', userController.handleBookActions);

export {router};