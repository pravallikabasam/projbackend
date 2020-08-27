const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuid } = require("uuid");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encrypted_password: {
      type: String,
      required: true,
      trim: true,
    },
    secret: String,
    roles: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
// Creating a Virtual to encrypt the password
userSchema
  .virtual("password")
  .set(function (password) {
    //console.log("Passsssssssssssss is " + password);
    this._password = password;
    this.secret = uuid(); // this is generating random hashcode
    this.encrypted_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password; // one you have declared inside the virtual
  });
// Creating a method that can take passsword as parameter and retur Encrypted Password
userSchema.methods = {
  authenticate: function (password) {
    return this.encryptPassword(password) === this.encrypted_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      const hash = crypto
        .createHmac("sha256", this.secret)
        .update(password)
        .digest("hex");
      // console.log("Encrypted password for " + password + " is " + hash);
      return hash;
    } catch (error) {
      //end of try
      return "";
    } // end of catch
  }, // end of encryptedpassword
}; //end of userSchema.methods

// To use this schema anywhere outside we have to export this
module.exports = mongoose.model("User", userSchema);
