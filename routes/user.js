const express=require('express');
const router=express.Router();
const {getUserById,getUser, updateUser, getUserPurchaseList}=require('../controllers/user')
const {isSignedIn , isAuthenticated}=require('../controllers/authentication')

router.param('userId',getUserById)
router.get('/user/:userId',isSignedIn, isAuthenticated, getUser);

//route for user to update his own information
router.put('/updateUser/:userId',isSignedIn, isAuthenticated, updateUser);

//Route for getting userPurchase List
router.get('/user/orderList/:userId',isSignedIn, isAuthenticated, getUserPurchaseList);

module.exports= router 