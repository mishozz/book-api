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
    },
    imageSource:{
        type: String,
        required: true
    },
    users:[{
        type: mongoose.Types.ObjectId,
        ref: "Users"
    }]
})

export default mongoose.model('Books', Book);
