import mongoose from 'mongoose'

const Genre = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    books: [{
        type: mongoose.Types.ObjectId,
        ref: 'Books'
    }]
})

export default mongoose.model('Genres', Genre)
