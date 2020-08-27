const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwtwebtoken = require("jsonwebtoken");
var expressjwt = require("express-jwt");
//Sign Up controller
exports.signup = (req, res) => {
  const user = new User(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  user.save((error, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save the user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
  //console.log(req.body);
};

//Sign In Controller
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }
  User.findOne({ email }, (err, obj) => {
    if (err || !obj) {
      return res.status(400).json({
        err: "User does not exist",
      });
    }
    if (!obj.authenticate(password)) {
      return res.status(401).json({
        err: "Wrong password!!!!",
      });
    }

    const token = jwtwebtoken.sign({ _id: obj._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = obj;
    return res.json({ token, user: { _id, name, email, role } });
  });
  //console.log(req.body);
}; //end of signin

//Signed out Controller
exports.signout = function (req, res) {
  res.clearCookie("token");
  res.json({
    err : "User signout successfull"
  });
};

//custom isSignedIn middleware
exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//custom middleware for isAuthenticated
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!checker) {
    return res.status(401).json({
      error: "Not Authenticated!!",
    });
  }
  next();
};

//custom isAdmin middleware
exports.isAdmin = (req, res, next) => {
  if (!req.profile.roles === 1) {
    //Here were are assuming Admin role as 1
    return res.status(403).json({
      error: "Access Denied for Admin Portal",
    });
  }
  next();
};
