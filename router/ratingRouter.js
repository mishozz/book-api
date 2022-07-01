import express from 'express';
import RatingController from '../controller/ratingController.js'
import AuthClient from '../middleware/auth.js'

const router = express.Router();
const ratingController = new RatingController();
const authClient = new AuthClient();

router.get('/', ratingController.getAll);

router.get('/:id', ratingController.getRating);

router.put('/:id', [authClient.verifyToken,authClient.isUserOrAdmin],ratingController.updateRating)

export {router};
