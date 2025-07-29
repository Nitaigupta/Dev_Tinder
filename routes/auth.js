const express = require('express');
const authRouter = express.Router();
const {validateSingUpData} = require("../utils/validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {userAuth } = require("../middleware/auth");
authRouter.post('/signup', async (req,res)=>{
 
  try{
    // validation of data
     validateSingUpData(req);
     const{firstName,lastName,emailId,password} = req.body;
     //Encrypt The Password
     const passwordHash = await bcrypt.hash(password, 10);
    

  //creating a new instance of user model
  const user = new User({
    firstName,lastName,emailId,password:passwordHash,
  });
    await user.save();
  res.send("user Added");
  }
  catch(err){
    res.status(400).send("Error saving the user:"+ err.message);
  }

});
authRouter.post('/login', async(req,res)=>{
  try{
    const{emailId,password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid Credential");
    }
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
      const token = await user.getJWT();
      res.cookie("token",token,{expires: new Date(Date.now()+8*3600000)});

      res.send("Login Successfully");
    }
    else{
      throw new Error("Invalid Credential");
    }

  }
  catch(err){
    res.status(400).send("Error in login"+err.message);

  }

});
authRouter.post('/logout',async(req,res)=>{
res.cookie("token",null,{
  expires: new Date(Date.now()),
});
res.send("Logout Successfull");
});
module.exports=authRouter; 