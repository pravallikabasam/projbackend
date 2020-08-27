const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 32
    },
    description: {
      type: String,
      trim: true,
      maxLength: 2000
    },
    price: {
      type: Number,
      required: true,
      maxLength: 32
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true
    },
    stock: {
      type: Number,
      required : true
    },
    sold: {
      type: Number,
      default: 0
    },
    photo: {
      data  : Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
