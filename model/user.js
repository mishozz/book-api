import mongoose from 'mongoose'

const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    takenBooks: [{
        type: String,
    }],
    returnedBooks: [{
        type: String,
    }]
})

export default mongoose.model('Users', User)
