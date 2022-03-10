import express from 'express';
const router = express.Router();
import Book from '../model/books.js'

router.get('/', async (_req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch(err) {
        res.json({message: err}).status(500);
    }
});

router.get('/:isbn', async (req, res) => {
    try {
        const book = await Book.find({isbn: req.params.isbn});
        res.json(book);
    } catch(err) {
        res.json({message: err}).status(500);
    }
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const book = new Book({
        isbn: req.body.isbn,
        description: req.body.description,
        availableCopies: req.body.availableCopies
    })
    
    try{
        const savedBook = await book.save();
        res.json(savedBook);
    } catch(err) {
        res.json({message: err}).status(500);
    }
})

router.delete('/:isbn', async (req, res) => { 
    try{
        await Book.remove({isbn: req.params.isbn});
        res.status(204).send()
    } catch(err) {
        res.json({message: err}).status(500);
    }
})


export {router};
