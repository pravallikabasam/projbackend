require("dotenv").config();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
var cors = require("cors");
const express = require("express");
//const cookieParser = require("cookie-parser");
const app = express();

/*--------------------------MiddleWare--------------------------*/

app.use(bodyparser.json());
app.use(cookieparser());
app.use(cors());

/*--------------------------Port--------------------------*/

const port = process.env.PORT || 3000;

/*--------------------------DataBases--------------------------*/

mongoose
  .connect(process.env.DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`Database is Connected`);
  });

/*---------SignUp----SignIn-----SignOut---Routes--------------------------*/
var authenticationRoutes = require("./routes/authentication");
app.use("/lifestylestore", authenticationRoutes);

/*---------User----Routes--------------------------*/
var userRoutes = require("./routes/user");
app.use("/lifestylestore", userRoutes);

/*---------Category----Routes--------------------------*/
var categoryRoutes = require("./routes/category");
app.use("/lifestylestore", categoryRoutes);

/*---------Products----Routes--------------------------*/
var productRoutes = require("./routes/product");
app.use("/lifestylestore", productRoutes);

/*---------Orders----Routes--------------------------*/
var orderRoutes = require("./routes/order");
app.use("/lifestylestore", orderRoutes);

/*--------------------------Starting a Server--------------------------*/
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
