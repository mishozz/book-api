import mongoose from 'mongoose'

const User = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    takenBooks: {
        type: mongoose.Types.ObjectId,
        ref: 'Book'
    },
    returnedBooks: {
        type: mongoose.Types.ObjectId,
        ref: 'Book'
    }
})

export default mongoose.model('Users', User)