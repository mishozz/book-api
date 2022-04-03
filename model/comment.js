import mongoose from 'mongoose'

const Comment = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    }
})

export default mongoose.model('Comment', Comment);
