import mongoose from 'mongoose'

const Rating = mongoose.Schema({
    total: {
        type: Number,
        default: 0
    },
    referenceBookIsbn : {
        type: String,
        required: true
    },
    oneStar: {
        type: Number,
        default: 0
    },
    twoStar: {
        type: Number,
        default: 0
    },
    threeStar : {
        type: Number,
        default: 0
    },
    fourStar: {
        type: Number,
        default: 0
    },
    fiveStar: {
        type: Number,
        default: 0
    },
    voters: [{
        type: String,
        default:[]
    }]
})

export default mongoose.model('Rating', Rating);
