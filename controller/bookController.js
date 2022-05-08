import Book from '../model/books.js'
import crypto from 'crypto'

class BookController {
    getAll = async (req, res) => {
        const title = req.query.title
        const page = req.query.page;

        let limit = req.query.limit;
        if(!limit) {
            limit = 5;
        }

        let books;
        try {
            if(title) {
                const book = await Book.findOne({title: title});
                if(!book) {
                    return res.status(404).send();
                }
                return res.json(book);
            }

            if(!page) {
                books = await Book.find();
            } else {
                books = await Book.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            }

            const totalCount = await Book.countDocuments();

            return res.json({books, totalBooks: totalCount});
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

    getBooksByGenre = async (req, res) => {
        const page = req.query.page;

        let limit = req.query.limit;
        if(!limit) {
            limit = 5;
        }

        try {
            let books;       
            if(!page) {
                books = await Book.find({genre: req.params.genre});
            } else {
                books = await Book.find({genre: req.params.genre})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            }

            const totalCount = await Book.countDocuments({genre: req.params.genre});
            return res.json({books:books, totalBooks: totalCount});
        } catch(err) {
            return res.status(500).json({message: err});
        }
    }


    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    createBook = async (req, res) => {   
        const isbn = this.uuidv4()
        try{
            let book = await Book.findOne({isbn: isbn});
            if(book) {
                return res.status(409).send();
            }
    
            book = new Book({
                isbn: isbn,
                title: req.body.title,
                description: req.body.description,
                availableCopies: req.body.availableCopies,
                imageSource: req.body.imageSource,
                genre: req.body.genre
            })

            await book.save();
            return res.json(book).status(201);
        } catch(err) {
            return res.json({message: err}).status(500);
        }
    }

    updateBook = async (req, res) => {   
        try{
            let book = await Book.findOne({isbn: req.params.isbn});
            if(!book) {
                return res.status(404).send();
            }
    
            book.title = req.body.title;

            book.description = req.body.description;
            book.availableCopies = req.body.availableCopies;
            book.imageSource = req.body.imageSource;
            book.genre = req.body.genre;
    
            await Book.findOneAndUpdate({'_id': book._id}, book);
            return res.json(book).status(200);
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
