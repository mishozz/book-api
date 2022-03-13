import Book from '../model/books.js'

class BookController {
    getAll = async (_req, res) => {
        try {
            const books = await Book.find();
            return res.json(books);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    getBook = async (req, res) => {
        try {
            const book = await Book.findOne({isbn: req.params.isbn});
            if(!book) {
                return res.status(404).send();
            }
            return res.json(book);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    createBook = async (req, res) => {   
        try{
            let book = await Book.findOne({isbn: req.body.isbn});
            if(book) {
                return res.status(409).send();
            }
    
            book = new Book({
                isbn: req.body.isbn,
                description: req.body.description,
                availableCopies: req.body.availableCopies
            })
    
            await book.save();
            return res.json(book).status(201);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    deleteBook = async (req, res) => { 
        try{
            const book = await Book.findOne({isbn: req.params.isbn});
            if(!book) {
                return res.status(404).json({message: "Book not found"});
            }
            await Book.deleteOne({isbn: req.params.isbn});
            return res.status(204).send();
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }
}

export default BookController
