const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    disc: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    category: {
        type: String,
        enum: ['All', 'Apparels', 'Electronics', 'Footwear', 'Books'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Product = mongoose.model('Product', productSchema)
module.exports = Product