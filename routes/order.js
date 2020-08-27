const express= require('express');
const router= express.Router();
const { body } = require('express-validator');

const {updateInventory} = require('../controllers/product');
const {isSignedIn , isAuthenticated, isAdmin} = require('../controllers/authentication');
const {getUserById , pushOrdersToUserPurchaseList} = require('../controllers/user');
const {getOrderById ,createOrder, getAllOrders,getOrderStatus,updateOrderStatus } = require('../controllers/order');

router.param('userId',getUserById);
router.param('orderId',getOrderById);

//Route to create Order
router.post('/createOrder/:userId',isSignedIn,isAuthenticated,pushOrdersToUserPurchaseList,updateInventory,createOrder);

//Route to get All orders
router.get('/getAllOrders/:userId',isSignedIn,isAuthenticated,isAdmin,getAllOrders);

//Router to getStatusOfOrder
router.get('/getOrderStatus/:orderId/:userId',isSignedIn,isAuthenticated ,isAdmin,getOrderStatus);

//Router to updateOrderStatus
router.put('/updateOrderStatus/:userId/:orderId', isSignedIn,isAuthenticated,isAdmin , updateOrderStatus);

module.exports = router;