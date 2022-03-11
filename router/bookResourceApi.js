import express from 'express';
import Book from '../model/books.js'

const router = express.Router();

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
    try{
        let book = await Book.findOne({isbn: bookToBeCreated.isbn});
        if(book) {
            res.status(409).send();
            return;
        }

        book = new Book({
            isbn: req.body.isbn,
            description: req.body.description,
            availableCopies: req.body.availableCopies
        })

        await book.save();
        res.json(book);
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
