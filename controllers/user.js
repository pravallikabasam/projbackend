const User = require('../models/user');
const {Order} = require('../models/order');
exports.getUserById= (req,res,next,id)=>{
    //TODO
    User.findById(id).exec((error, obj)=>{
        if(error || !obj)
        {
           return res.status(400).json({
                  err : "Access Denied"
            });
        }
        req.profile= obj;
        next();
    });
    
    };
//Getting Single User
exports.getUser = (req,res)=>{
    if(!req.profile)
    {
        return res.status(400).json({
            err : "No Such User Found"
        });
    }
    //We are Hiding out secret and password from req.profile for security reasons.
    req.profile.secret=undefined;
    req.profile.encrypted_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile);
};

//getting all users from the DataBase
exports.updateUser= (req,res)=>{
    User.findByIdAndUpdate({_id : req.profile._id},{$set : req.body},
        {new : true , useFindAndModify : false},(error,obj)=>{
            if(error)
            {
                return res.status(400).json({
                    err : "Error!! while processing the request"
                });
            }
            obj.secret = undefined;
            obj.encrypted_password = undefined;
            obj.createdAt=undefined;
            obj.updatedAt=undefined;
            res.json(obj);
    });
}

//getting userPurchaseList
exports.getUserPurchaseList= (req, res)=>{
    ///Order.find
    Order.find({user : req.profile._id}).populate('user' , "_id name").exec((error,orders)=>{
        if(error)
        {
            return res.status(400).json({
                err : "No Orders Yet!!!!"
            });
        }
        //orders.transaction_id=undefined;
        //orders.updated=undefined;
        res.json(orders);
    })

}

//Pushing orders to user Purchase List
exports.pushOrdersToUserPurchaseList = (req, res , next)=>{
    let purchases = [];
    req.body.order.products.map(product=>{
        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            price : product.price,
            category : product.category,
            quantity : product.quantity,
            transaction_id : req.body.order.transaction_id

        });
    });
    User.findOneAndUpdate({_id : req.profile._id},{$push : {purchases : purchases}},
        {new : true , useFindAndModify :false}).exec((error , updatedUser)=>{
            if(error)
        {
            return res.status(400).json({
                err : "No Orders Yet!!!!"
            });
        }
        res.json(updatedUser);
    });
    next();

}