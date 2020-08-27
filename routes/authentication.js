var express = require("express");
var router = express.Router();
const { body } = require("express-validator");
const { signin, signout, signup } = require("../controllers/authentication");

//defining SignIn Route
router.post(
  "/signin",
  [
    //validate email
    body("email").isEmail().withMessage("Enter a Valid Email Id"),
    //Check for valid Domain
    body("password")
      .isLength({ min: 1 })
      .withMessage("Password seems suspicious"),
  ],
  signin
);
// defining post route for signup page
router.post(
  "/signup",
  [
    //validate email
    body("email").isEmail().withMessage("Enter a valid email Address"),
    //Check for valid Domain
    //validate firstname
    body("firstname")
      .isLength({ min: 3 })
      .withMessage("must be at least 3 chars long"),
    //validating password to have 8 charecters minimum
    body("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number")
      .matches(/(?=.*[A-Za-z])(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]/)
      .withMessage("must contain a special charected like @!&"),
  ],
  signup
);

// defining the signout route
router.get("/signout", signout);

module.exports = router;
