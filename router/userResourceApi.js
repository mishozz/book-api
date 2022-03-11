import express from 'express';
import bcrypt from 'bcrypt'
import Book from '../model/books.js'
import User from '../model/user.js'

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.json({message: err}).status(500);
    }
});

router.get('/:username', async (req, res) => {
    try {
        const user = await User.find({username: req.params.username});
        res.json(user);
    } catch(err) {
        res.json({message: err}).status(500);
    }
});

router.post('/register', async (req, res) => {
    try{
        let user = await User.findOne({username: req.body.username});
        if (user) {
            res.status(409).json({message: 'That user already exists'});
            return;
        }
    
        user = new User({
            username: req.body.username,
            password: req.body.password
        });
        console.log(user)

        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.send(user);
    } catch(err) {
        res.status(500).json({message: err});
    }
});

router.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({message: 'Incorrect username or password.'});
        }
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({message: 'Incorrect username or password.'});
        }

        res.send();
    } catch (err) {
        res.status(500).json({message: err});
    }
});

export {router};