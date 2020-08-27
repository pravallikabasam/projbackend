const express= require('express');
const router= express.Router();
const { body } = require('express-validator');

const {getProductById ,createProduct, getProduct,getProductPhoto,updateProduct, deleteProduct , getAllProducts,getAllCategories} = require('../controllers/product');
const {isSignedIn , isAuthenticated, isAdmin} = require('../controllers/authentication');
const {getUserById} = require('../controllers/user');

router.param('userId',getUserById);
router.param('productId',getProductById);

 
//route to create Product-------- only for admins----------
router.post('/createProduct/:userId',isSignedIn,isAuthenticated,isAdmin,
[
    body('name').not().isLength({ min: 3 }).withMessage('Not a valid name'),
    body('stock').not().isNumeric().withMessage('Not a valid Stock'),
    body('price').not().isNumeric().withMessage('Not a valid Price'),
    //body('category').isLength({ min: 3 }).withMessage('Not a valid category name')
],
createProduct);

//Route to get product
router.get('/getProduct/:productId',getProduct);

//route to get photo of the product alone
router.get('/getProductPhoto/:productId',getProductPhoto);

//Update the product----------------only by admin
router.put('/updateProduct/:userId/:productId',isSignedIn,isAuthenticated,isAdmin , updateProduct);

//delete the product----------------only by admin
router.delete('/deleteProduct/:userId/:productId',isSignedIn,isAuthenticated,isAdmin , deleteProduct);

//getAllProducts route
router.get('/getAllProducts',getAllProducts);

//get distinctCategories middleware to improve the performance
router.get('/getAllCategories',getAllCategories)

module.exports=router