import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
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
            let token = jwt.sign({ username: user.username , role: user.role}, process.env.PRIVATE_KEY, { //later get key from env
                expiresIn: 86400 // 24 hours
            });
    
            return res.json({ token: token});
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
                password: req.body.password,
                role: 'USER'
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

    handleBookActions = async(req,res) => {
        let query = req.query.action;
        if(query === 'take') {
            return this.takeBook(req,res);
        } else if (query === 'return') {
            return this.returnBook(req,res);
        } else {
            return res.status(400).send({message: 'The only allowed actions are: take and return'})
        }
    }

    takeBook = async(req, res) => {
        try{
            let book = await Book.findOne({isbn: req.body.isbn});
            if(!book) {
                return res.status(404).send();
            }

            let user = await User.findOne({username: req.username});
            if(!user) {
                return res.status(404).send();
            }

            if(user.takenBooks.includes(book._id)) {
                return res.status(409).send({message: 'Book is already taken by this user'});
            }
            
            if(book.availableCopies <= 0) {
                return res.status(400).send({message: 'No available copies left'})
            }

            await Book.findOneAndUpdate({ '_id': book._id }, { $addToSet: { users: user._id },  $set: { availableCopies: --book.availableCopies}});
            await User.findOneAndUpdate({ '_id': user._id }, { $addToSet: { takenBooks: book._id }});
            await User.findOneAndUpdate({ '_id': user._id }, { $pull: { returnedBooks: book._id }});

            return res.status(200).send();
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }

    returnBook = async(req, res) => {
        try{
            let book = await Book.findOne({isbn: req.body.isbn});
            if(!book) {
                return res.status(404).send();
            }

            let user = await User.findOne({username: req.username});
            if(!user) {
                return res.status(404).send();
            }

            console.log("username " +user.username)
            console.log("Taken books " +user.takenBooks)
            console.log('Book id ' + book._id)
            if(!user.takenBooks.includes(book._id)) {
                return res.status(400).send({message: 'The user does not own this book'});
            }

            await Book.findOneAndUpdate({ '_id': book._id }, { $pull: { users: user._id }, availableCopies: ++book.availableCopies});
            await User.findOneAndUpdate({ '_id': user._id }, { $pull: { takenBooks: book._id }});
            await User.findOneAndUpdate({ '_id': user._id }, { $addToSet: { returnedBooks: book._id }});

            return res.status(200).send();
        } catch (err) {
            return res.status(500).json({message: err});
        }
    }
}



export default UserController
