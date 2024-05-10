const express = require('express');
const catchAsync = require('../utils/CatchAsync');
const User = require('../models/usersModel')
app = express();


exports.getAllUser = catchAsync( async (req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        status: "success",
        count: users.length,
        data: {
            users
        }
    })
})

exports.getUserbyId =  (req,res)=>{
    res.status(500).json({
        status: "failure",
        message: "This feature is still in production!"
    })
}

exports.addUser = (req,res)=>{
    res.status(500).json({
        status: "failure",
        message: "This feature is still in production!"
    })
}


exports.updateUser = (req,res)=>{
    res.status(500).json({
        status: "failure",
        message: "This feature is still in production!"
    })
}


exports.deleteUser = (req,res)=>{
    res.status(500).json({
        status: "failure",
        message: "This feature is still in production!"
    })
}



