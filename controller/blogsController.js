const express = require('express');
const Blog = require('../models/blogsModel')
const CatchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');
// const fs = require('fs');
app = express();
app.use(express.json())


exports.getAllBlog = CatchAsync(async (req,res,next)=>{
    const blogs = await Blog.find()
    res.status(200).json({
        status: "success",
        count: blogs.length,
        data: {
            blogs
        }
    })
})

exports.getBlogbyId =  CatchAsync(async (req,res,next)=>{
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        return next(new AppError('Blog not found!',404))
    }
    res.status(200).json({
        status:"success",
        data: {
            blog
        }
    })
})

exports.addImage = CatchAsync(async (req,res,next)=>{
    console.log(req.file)
    res.status(200).json({
        status: "success",
        message: "Image uploaded successfully"
    })
})

exports.addBlog = CatchAsync(async (req,res,next)=>{
    // console.log("body",req.body)
    // console.log("file",req.file)
    req.body.imageCover = req.file.filename;
    req.body.author = req.user.name
    blog = await Blog.create(req.body)
    
    res.status(201).json({
        status:"success",
        data: {
            blog
        }
    })
})


exports.updateBlog = CatchAsync(async (req,res,next)=>{
    if(req.file){
        req.body.imageCover = req.file.filename
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    })
    if(!blog){
        return (new AppError('Blog not found!',404))
    }
    res.status(201).json({
        status:"success",
        data: {
            blog
        }
    })
})


exports.deleteBlog = CatchAsync(async (req,res,next)=>{
    blog = await Blog.findByIdAndDelete(req.params.id)
    if(!blog){
        return next(new AppError('Blog not found!',404))
    }
    res.status(204).json({
        status: "success",
        message: "Deletion successful!"
    })
})

