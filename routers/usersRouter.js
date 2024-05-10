const express = require('express');
const usersController = require('../controller/usersController')
const authController = require('../controller/authController')
const app = express();



const Router = express.Router()

Router.post('/signup', authController.signUP)
Router.post('/login',authController.login)
Router.post('/forgotPass',authController.forgotPassword)
Router.patch('/resetPass/:token',authController.resetPassword)
Router.get('/logout',authController.logout)
Router
.get('/',usersController.getAllUser)
.post('/',usersController.addUser)
.get('/:id',usersController.getUserbyId)
.patch('/:id',usersController.updateUser)
.delete('/:id',usersController.deleteUser)


module.exports = Router
