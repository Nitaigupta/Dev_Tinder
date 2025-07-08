const express = require('express');
const connectDB = require('./config/database');
require("./config/database")
const app = express();
const User = require("./models/User")

app.post('/signup', async (req,res)=>{
  const userObj = {
    firstName:"Shweta",
    lastName : "Gupta",
    emailId  : "sg@gmail.com",
    password : "4321"

  }
  //creating a new instance of user model
  const user = new User(userObj);
  try{
    await user.save();
  res.send("user Added");
  }
  catch(err){
    res.status(400).send("Error saving the user:"+ err.message);
  }

});

connectDB().then(()=>{
    console.log("Databse connected Succesfully");
    app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
}).catch((err)=>{
    console.log("Error While Connecting To DataBase");
});

