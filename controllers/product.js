const Product = require("../models/product");
const { validationResult } = require("express-validator");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const { updateOne } = require("../models/product");
//Middleware to GetProductById
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .exec((error, product) => {
      if (error) {
        return res.status(400).json({
          err: "Error while fetching the Product",
        });
      }
      if (!product) {
        return res.status(400).json({
          err: "No Product found!!",
        });
      }
      req.product = product;
      next();
    });
};

//Controller to CreateProduct ---only for admins...........
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {

      //handling errors
    if (error) {
      return res.status(400).json({
        err: "Error while processing the form data",
      });
    }

    //Checking for errors in Fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let product = new Product(fields);
    //Checking for errors in Files
    if(file.photo)
    {
        if(file.photo.size>3000000)
        {
            return res.status(400).json({
                err: "Image size too big!!",
              });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
    }

    //saving product
    product.save((error, product) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.json(product);
    });

  });
};

//Get Product by productId
exports.getProduct=(req,res)=>{
  if(!req.product)
  {
    return res.status(400).json({
      err : "No Product found"
    });
  }
  // to reduce the load on the response
  req.product.photo= undefined;
  req.product.createdAt = undefined;
  req.product.updatedAt = undefined;
  return res.json(req.product);
}

//getProductPhoto to improve the speed of the response 
exports.getProductPhoto = (req ,res ,next)=>{
  if(req.product.photo.data)
  {
    res.set('Content-Type' ,req.product.photo.contentType );
    res.send(req.product.photo.data);
  }
  next();
}
//route for updateProduct
exports.updateProduct = (req,res)=>{

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {

      //handling errors
    if (error) {
      return res.status(400).json({
        err: "Error while processing the form data",
      });
    }
    
    let product = req.product;
    product = _.extend(product,fields);
    //Checking for errors in Files
    if(file.photo)
    {
        if(file.photo.size>3000000)
        {
            return res.status(400).json({
                err: "Image size too big!!",
              });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
    }

    //saving product
    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          err : "Error while fetching Products"
        });
      }
      res.json(product);
    });

  });
 
}

//Controller to delete Product
exports.deleteProduct =(req , res)=>{
  let product = req.product;
  product.remove((error , deletedProduct)=>{
    if (error) {
      return res.status(400).json({
        err : "Error while deleting Product"
      });
    }
    res.json(deletedProduct);
  });
}

//controller to getAllProducts
exports.getAllProducts = (req ,res)=>{
  let limit = req.query.limit ? parseInt(req.query.limit) : 10; //getting limit from user and giving by default 10.
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'; //getting sortBy feature from user and giving by default _id to sort
  Product.find().select('-photo').populate('category').sort([[sortBy , "asc"]]).limit(limit).exec((error,allProducts)=>{
    if (error) {
      return res.status(400).json({
        err : "Error while fetching Products"
      });
    }
    res.json(allProducts);
  })
}


//Middleware to update Inventory when ever there is an order placed
exports.updateInventory = (req ,res, next)=>{
  let myOperations = req.body.order.products.map(product=>{
    return {
      updateOne : {
        filter : {_id : product._id},
        update : {stock : -product.count , sold : +product.count}
      }
    }
  });
  Product.bulkWrite(myOperations , {}, (error , product)=>{
    if (error) {
      return res.status(400).json({
        err : "Error while writing bulk operations on Products"
      });
    }
    res.json(product);
  })
}

//get allDistinctProducts
exports.getAllCategories = (req ,res)=>{
  Product.distinct("category").exec((error , categories)=>{
    if (error) {
      return res.status(400).json({
        err : "Error while fetching Categories!!"
      });
    }
    res.json(categories);
  })
}