import mongoose from 'mongoose'

const Book = mongoose.Schema({
    isbn: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    availableCopies: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Books', Book);
