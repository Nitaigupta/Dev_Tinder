const express = require('express');
const connectDB = require('./config/database');
require("./config/database")
const app = express();
const User = require("./models/User");


const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');



app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDB().then(()=>{
    console.log("Databse connected Succesfully");
    app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
}).catch((err)=>{
    console.log("Error While Connecting To DataBase");
});

