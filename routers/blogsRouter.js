const express = require('express');
const blogsController = require('../controller/blogsController')
const authController = require('../controller/authController')
const app = express();
const multer = require('multer')

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const imageUpload = multer({ storage: imageStorage });


const Router = express.Router()

// Router.param('id',toursController.checkID)
// .get('/',authController.protectRoute,blogsController.getAllBlog)


Router
.get('/',authController.protectRoute,blogsController.getAllBlog)
.post('/',authController.protectRoute,imageUpload.single('image'),blogsController.addBlog)
.get('/:id',authController.protectRoute,blogsController.getBlogbyId)
.patch('/:id',authController.protectRoute,imageUpload.single('image'),blogsController.updateBlog)
.delete('/:id',authController.protectRoute,blogsController.deleteBlog)


module.exports = Router
