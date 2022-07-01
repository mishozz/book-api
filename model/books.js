import mongoose from 'mongoose'

const Book = mongoose.Schema({
    isbn: {
        type: String,
        required: true
    },
    title: {
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
    },
    imageSource:{
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },
    users:[{
        type: String
    }]
})

export default mongoose.model('Books', Book);
