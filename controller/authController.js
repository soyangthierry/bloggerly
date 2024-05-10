const User = require('../models/usersModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync')
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const sendMail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({userId:id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
    })
}

const issueCookie = (res,id,status,user) => {
    const token = signToken(id)
    res.cookie('token',token,{
        httpOnly: true
    })
    if(user){
        res.status(status).json({
            status: "success",
            user: user,
            token
        })
    }else {
        res.status(status).json({
            status: "success",
            token
        })
    }
}
exports.signUP = catchAsync(async (req,res,next)=> {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        changedPasswordAt: req.body.changedPasswordAt,
        role: req.body.role
    })
    /*token = signToken(newUser._id)
    res.status(201).json({
        token,
        status: "success",
        data: {
            user: newUser
        }
    })*/
    issueCookie(res,newUser._id,201,newUser)
})
exports.logout = catchAsync(async (req,res,next)=>{
    res.cookie('token','',{
        httpOnly: true
    })
    res.status(200).json({
        status: "success",
        message: "Log out successful"
    })
})
exports.login = catchAsync(async (req,res,next)=>{
    const {email,password} = req.body
    //check if provided
    if(!email||!password){
        return next(new AppError('Please provide user name or password',400))
    }
    //check if match
    const user = await User.findOne({email}).select('+password')
    if(!user || !(await user.verifyPass(password,user.password))){
        return next(new AppError('Incorrect username or password',401))
    }
    //send token
    /*const token = signToken(user._id)
    res.status(200).json({
        staus: "success",
        data: {
            token
        }
    })*/
    issueCookie(res,user._id,200,user)
} )


exports.protectRoute = catchAsync(async (req,res,next) => {
    let candidateToken
    //console.log(req.headers)
    //check if token authorization was provided
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return next(
            new AppError('You are not authenticated, please log in',401)
        )
    }
    //check is token is valid
    candidateToken = req.headers.authorization.split(' ')[1];

    const decodedToken = await promisify(jwt.verify)(candidateToken,process.env.JWT_SECRET)
    //console.log("decoded token",decodedToken)

    //user still exists

    if(! await User.findById(decodedToken.userId)){
        return next(
            new AppError("User does not exist",401)
        )
    }

    // user hasn't changed password
    const newUser = await User.findById(decodedToken.userId)
    newUser.isPassowordChanged(decodedToken.iat);
    //console.log(newUser);
    if(newUser.isPassowordChanged(decodedToken.iat)){
        return next(new AppError("User changed password recently, please login again",401));
    }
    req.user = newUser;
    next()
})


exports.forgotPassword = catchAsync(async (req,res,next) => {
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next(new AppError("No user with such an email",404))
    }
    const tokenRaw = user.createRecovery();
    await user.save({ validateBeforeSave: false }); //😭 salient 

    const text = `Here is the link to recover your password ${req.protocol}://${req.get('host')}/bloggerly/api/v1/users/resetPass/${tokenRaw}`;
    const subject = `Password recovery: expires in 10 minutes`;
    const to = req.body.email;
    try {
        await sendMail({
            mail:to,
            subject,
            message:text
        })
        res.status(200).json({
            status: "success",
            message: "Mail sent successfully"
        })
    } catch (error) {
        user.resetToken = undefined;
        user.resetTokenExp = undefined;
        await user.save({ validateBeforeSave: false });
        /*res.status(500).json({
            status: "fail",
            message: "Mail not sent please try again"
        })*/
        return new AppError("Mail not sent please try again", 500);
    }
})

exports.resetPassword = catchAsync(async (req,res,next)=>{
    const tokenRaw = req.params.token;
    const resetToken = crypto.createHash('sha256').update(tokenRaw).digest('hex');
    //console.log(resetToken)
    const user = await User.findOne({resetToken,resetTokenExp:{$gt:Date.now()}});
    //console.log(user)
    if(!user){
        return next(new AppError("Your reset token is no longer valid, retry the process",401))
    }else {

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.resetToken = undefined;
        user.resetTokenExp = undefined;
        await user.save()
        /*const token = await signToken(user._id)
        res.status(201).json({
            status: "success",
            token,
            data: {
                user
            }
        })*/
        issueCookie(res,user._id,201,user)
    }
})

exports.changePassword = catchAsync(async (req,res,next) => {
    const user = await User.findOne({_id:req.user._id}).select('+password');
    //console.log(user)
    if(!await user.verifyPass(req.body.passwordCurrent,user.password)){
        return next(new AppError("Incorrect password",402))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    const token = await signToken(user._id)
    /*res.status(201).json({
        status: "success",
        token,
        data: {
            user
        }
    })*/
    issueCookie(res,user._id,201,user)
})