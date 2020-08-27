const mongoose = require("mongoose");
//const product = require('./product');
const { ObjectId } = mongoose.Schema;

const ProductInCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product"
  },
  count: Number,
  price: Number
});
const OrderSchema = new mongoose.Schema(
  {
    products: [ProductInCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    status : {
      type : String,
      default : "",
      enums : ["Recieved","Processing","Shipped","Out for Delivery","Delivered","Cancelled"]
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
const ProductInCart = mongoose.model("ProductInCart", ProductInCartSchema);
module.exports = { Order, ProductInCart };
