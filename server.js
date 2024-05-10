const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({path:'./config.env'})

process.on('uncaughtException',err=>{
    console.log(err.name,err.message,err)
    console.log("Shutting down server!")
    process.exit(1)
})
const app = require('./app')

var DB = process.env.DB_STRING.replace('<password>',process.env.DB_PASSWORD)

mongoose.connect(DB).then (()=>{
    console.log("connection success,")
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`Running on port ${process.env.PORT}`)
})

process.on('unhandledRejection',err=>{
    console.log(err.name, err.message, err)
    console.log("Shutting down server!")
    server.close(()=>{
        process.exit(1)
    })
})