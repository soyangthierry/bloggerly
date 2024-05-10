
const mongoose = require('mongoose')

blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        trim: true,
        unique: true,
        maxlength: [500, "A blog title cannot be more than 500 characters long"],
        minlength: [10, "A blog title cannot be less than 100 characters long"]
    },
    tags: {
        type: [String],
        required: [true, "Please provide a category"]
    },
    author: {
        type: String,
        required: [true, "Author field must be specified"],
        trim: true,
        maxlength: [100, "Author name cannot exceed 100 characters"],
        minlength: [2, "Author name cannot be less than 2 characters"]
    },
    summary: {
        type: String,
        required: [true, "Summary is required"],
        trim: true,
        maxlength: [100, "Summary cannot exceed 500 characters"],
        minlength: [2, "Summary cannot be less than 50 characters"]
    },
    description: String,
    imageCover: {
        type: String,
        required: [true, "Cover image is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})


const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog