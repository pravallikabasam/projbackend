//Controller to create Category
const Category = require('../models/category');
const { validationResult } = require("express-validator");
const category = require('../models/category');


//Middleware getCategoryById
exports.getCategoryById = (req, res,next,id)=>{
Category.findById(id).exec((error,category)=>{
    if(error)
    {
        return res.status(400).json({
            err : "Error while processing the request!!"
        });
    }
    if(!category)
    {
        return res.status(400).json({
            err : "Couldn't fetch any Categories!!"
        });
    }
        category.createdAt = undefined;
        category.updatedAt = undefined;
    req.category = category;
    next();
});
}


//Controller to createCategory
exports.createCategory = (req,res)=>
{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(401).json({
            errors : errors.array()
        });
    }
    const category=new Category(req.body);
    category.save((error,category)=>
    {
        if(error)
        {
            return res.status(400).json({
                err : "Couldn't save the category to Database"
            });
        }
        res.json(category);
    });
}

//Controller to get Category
exports.getCategory = (req, res)=>{
    if(!req.category)
    {
        return res.status(400).json({
            err : "Couldn't fetch any Categories!!"
        });
    }
    
    return res.json(req.category);
}

//Controller to getAllCategories
exports.getAllCategories =(req , res)=>{
    Category.find().exec((error,categories)=>{
if(error || !categories)
{
    return res.status(400).json({
        err : "Couldn't fetch any Categories!!"
    });
}
categories.createdAt=undefined;
categories.updatedAt=undefined;
return res.json(categories)
    });
}
//Controller to update Category
exports.updateCategory = (req, res)=>{
    Category.findByIdAndUpdate({_id : req.category._id},{$set : req.body},{new:true , useFindAndModify:false}).exec((error,category)=>
    {
        if(error){
            return res.status(400).json({
                err : "Error while updating the category!!!"
            });
        }
        return res.json(category);
    });
}

exports.deleteCategory = (req , res)=>{
    Category.findByIdAndDelete({_id : req.category._id}).exec((error , category)=>{
        if(error){
            return res.status(400).json({
                err : "Error while deleting the category!!!"
            });
        }
       return res.json({msg : "Successfully deleted "+category.name + " category"});
    })
}
