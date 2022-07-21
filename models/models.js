const mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        unique: true
    },
    status: {
        required: true,
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    utimestamp: {
        type: Date,
        default: Date.now
    }
})

const postSchema = new mongoose.Schema({
    category: {
        type: mongoose.ObjectId,
        required: true
    },
    title: {
        required: true,
        type: String,
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    image: {
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
    status: {
        required: true,
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    utimestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = {
    'category': mongoose.model('Category', categorySchema),
    'posts': mongoose.model('Posts', postSchema),
}