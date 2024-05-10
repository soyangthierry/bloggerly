const express = require('express');
const morgan = require('morgan')
const blogsRouter = require('./routers/blogsRouter')
const errorsController = require('./controller/errorsController')
const AppError = require('./utils/AppError')
const usersRouter = require('./routers/usersRouter')
const path = require('path')
const cors = require('cors');
const app = express();
app.use(express.json())

//console.log(process.env)
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use('/static', express.static(path.join(__dirname, 'uploads')))
app.use(morgan('dev'))
app.use('/bloggerly/api/v1/users',usersRouter)
app.use('/bloggerly/api/v1/blogs',blogsRouter)
app.all('*',(req,res,next)=>{
    next(new AppError(`${req.originalUrl} not found on server`,404))
})
app.use(errorsController.globalError)
module.exports = app
