import mongoose from 'mongoose'

const Comment = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
    },
    referenceBookIsbn : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

export default mongoose.model('Comment', Comment);
