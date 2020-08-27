const express= require('express');
const router = express.Router();
const { body } = require("express-validator");

const {isSignedIn , isAuthenticated, isAdmin} = require('../controllers/authentication');
const {getUserById} = require('../controllers/user');
const {getCategoryById, createCategory, getCategory, updateCategory ,getAllCategories, deleteCategory} = require('../controllers/category');
const { update } = require('../models/user');

//Middleware to getUserById
router.param("userId",getUserById);

//Middleware to getCategoryById
router.param("categoryId",getCategoryById);


//route for creating Category ---only for admins
router.post('/category/create/:userId',[body('name').isLength({min : 3}).withMessage("Doesn't seem like a valid Category Name")], isSignedIn , isAuthenticated, isAdmin ,createCategory);

//route to get category
router.get('/category/:categoryId',getCategory);

//Get All Categories
router.get('/allCategories',getAllCategories);

// route to update category ---only for admins
router.put('/category/updateCreate/:userId/:categoryId',updateCategory);

//route to delete catogory ---only for admins
router.delete('/deleteCategory/:userId/:categoryId',isSignedIn, isAuthenticated , isAdmin, deleteCategory);


module.exports=router