const Order = require('../models/order');
//const formidable = require('formidable');

//Middleware getOrderById
exports.getOrderById = (req ,res,next,id)=>{    
Order.findById(id).populate('products.product' , "name price").exec((error , order)=>{
    if(error)
    {
        return res.status(400).json({
            err: "Error while fetching the order!!"
        });
    }
    req.order= order;
    next();
});
}

//Controller to Create Order
exports.createOrder =(req, res)=>{
    let order = new Order(req.body);
    req.body.order.user = req.profile;
    order.save((error,order)=>{
        if(error)
    {
        return res.status(400).json({
            err: "Error while saving the order to DB!!"
        });
    }
    res.json(order);
    })

}

//Controller to Get All Orders
exports.getAllOrders = (req,res)=>{
    Order.find({}).populate("user","_id name").exec((error , orders)=>{
        if(error)
        {
            return res.status(400).json({
                err: "Error while fetching Orders!!"
            });
        }
        res.json(orders);
    })
}
        
//Controller to getOrderStatus
exports.getOrderStatus = (req,res)=>{
if(!req.order)
{
    return res.status(400).json({
        err: "Error while fetching the order status!!"
    });
}
return res.send({
    _id : req.order._id,
    status : req.order.status
});
}
/*
return res.json(Order.schema.path("status").enums);
*/
exports.updateOrderStatus = (req,res)=>{
    Order.findByIdAndUpdate({_id : req.order._id},{$set : {status : req.body.status}},
        {new :true , useFindAndModify:false}).populate("user","_id name").exec((error , updatedOrder)=>{
        if(error)
        {
            return res.status(400).json({
                err: "Error while updating Order!!"
            });
        }
        res.json(updatedOrder);
    });
}