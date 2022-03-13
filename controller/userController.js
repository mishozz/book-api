import express from 'express';
import bcrypt from 'bcrypt'
import Book from '../model/books.js'
import User from '../model/user.js'

class UserController {
    login = async (req, res) => {
        try {
            let user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(400).json({message: 'Incorrect username or password.'});
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: 'Incorrect username or password.'});
            }
    
            return res.send();
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }

    register = async (req, res) => {
        try{
            let user = await User.findOne({username: req.body.username});
            if (user) {
                return res.status(409).json({message: 'That user already exists'});
            }
        
            user = new User({
                username: req.body.username,
                password: req.body.password
            });
    
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            return res.send(user).status(201);
        } catch(err) {
            return res.status(500).json({message: err});
        }
    }

    getPerson = async (req, res) => {
        try {
            const user = await User.findOne({username: req.params.username});
            if(!user) {
                return res.status(404).send();
            }
            return res.json(user);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    getAll = async (_req, res) => {
        try {
            const users = await User.find();
            return res.json(users);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }
}

export default UserController
