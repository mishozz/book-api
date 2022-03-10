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
    const bookToBeCreated = new Book({
        isbn: req.body.isbn,
        description: req.body.description,
        availableCopies: req.body.availableCopies
    })
    
    try{
        const books = await Book.find({isbn: bookToBeCreated.isbn});
        if(books.length !== 0) {
            res.status(409).send();
            return;
        }

        const savedBook = await bookToBeCreated.save();
        res.json(savedBook);
    } catch(err) {
        console.log(err)
        res.json({message: err}).status(500);
    }
})

router.delete('/:isbn', async (req, res) => { 
    try{
        const books = await Book.find({isbn: req.params.isbn});
        if(books.length === 0) {
            res.status(404).json({message: "Book not found"});
            return;
        }
        await Book.deleteOne({isbn: req.params.isbn});
        res.status(204).send()
    } catch(err) {
        res.json({message: err}).status(500);
    }
})


export {router};
