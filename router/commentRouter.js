import express from 'express';
import CommentController from '../controller/commentController.js'
import AuthClient from '../middleware/auth.js'

const router = express.Router();
const commentController = new CommentController();
const authClient = new AuthClient();

router.get('/', commentController.getAll);

router.get('/:id', commentController.getComment);

router.post('/',[authClient.verifyToken,authClient.isUserOrAdmin], commentController.createComment);

router.put('/:id',[authClient.verifyToken,authClient.isUserOrAdmin], commentController.editComment);

router.delete('/:id',[authClient.verifyToken,authClient.isUserOrAdmin], commentController.deleteComment);


export {router};
