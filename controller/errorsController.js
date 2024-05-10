const AppError = require("../utils/AppError")

const prodError = (err,req,res,next)=> {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else {
        console.log("Something went wrong",err)
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
}

const devError = (err,req,res,next)=> {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    })
}


exports.globalError=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if(err.name == "CastError"){
        // err.message = 'Invalid ID format'
        // err.statusCode = 400
        err = new AppError('Invalid ID format', 400)
    }
/*    if(err.code = 11000){
        // err.message = "Two documents can't have the same name"
        // err.statusCode = 400
        err = new AppError("Two documents can't have the same name", 400)
    }
*/
    if(err.code = 11000 && err.keyValue){
        const duplicateField  = Object.keys(err.keyValue).join(' ')
        const message = `You cannot use this ${duplicateField} because it is already used by another field in the database`;
        err = new AppError(message,400)
    }
    if(err.name == "ValidationError"){
        // err.statusCode = 400
        const message = Object.values(err.errors).map(error=>error.message).join(' ')
        err = new AppError(message, 400)
    }
   if(process.env.NODE_ENV == 'production'){
    console.log(process.env.NODE_ENV)
    prodError(err,req,res,next)
   }else if (process.env.NODE_ENV == 'development'){
    console.log(process.env.NODE_ENV)
    devError(err,req,res,next)
   }
}