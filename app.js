const express = require('express');
const connectDB = require('./config/database');
require("./config/database")
const app = express();
const User = require("./models/User");
const {validateSingUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post('/signup', async (req,res)=>{
 
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
app.post('/login', async(req,res)=>{
  try{
    const{emailId,password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid Credential");
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(isPasswordValid){
      res.send("Login Successfully");
    }
    else{
      throw new Error("Invalid Credential");
    }

  }
  catch(err){
    res.status(400).send("Error in login"+err.message);

  }

})

// get user by email
app.get('/user',async (req,res)=>{
  const userEmail = req.body.emailId;
  try{
    const user = await User.find({emailId:userEmail});
    if (user.length===0) {
      res.status(404).send("User Not Found !!!")
    }
    else{
      res.send(user);
    }
  }
  catch{
    res.status(400).send("Something Went Wrong")
  }

});
app.get('/feed',async (req,res)=>{
    try{
    const user = await User.find({});
    if (user.length===0) {
      res.status(404).send("User Not Found !!!")
    }
    else{
      res.send(user);
    }
  }

  catch{
    res.status(400).send("Something Went Wrong");
  }

})
app.get('/id' , async(req,res)=>{
  const id = req.body._id;
  try{
    const userid = await User.findById({_id:id}).exec();
    res.status(200).send(userid);

  }
  catch{
    res.status(400).send("Something Went Wrong");

  }
})

app.delete('/delete', async(req,res)=>{
   const id = req.body._id;
  try{
    const userid = await User.findByIdAndDelete({_id:id});
    res.status(200).send("User Deleted Succesully");

  }
   catch{
    res.status(400).send("Something Went Wrong");

  }

})
app.patch('/updateid/:id',async(req,res)=>{
  const id = req.params.id;
  const data = req.body;
  
  try{
  //   const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
  // const isUpdateAllowed = Object.keys(data).every((k)=>{
  //   ALLOWED_UPDATES.includes(k);
  // })
  // if(!isUpdateAllowed){
  //   throw new Error("Update Not Allowed");
  // }

      const userid = await User.findByIdAndUpdate({_id:id},data,{
        returnDocument :"after",
        runValidators:true,
      });
    res.status(200).send("User Deleted Succesully");


  }
   catch{
    res.status(404).send("Something Went Wrong");

  }
})
app.patch('/updateemail' ,async(req,res)=>{
     const email = req.body.emailId;
     const data = req.body;
  try{
 const user = await User.findOneAndUpdate({emailId:email},data);
 res.send("User Updated Succesfuuly");


  }
  catch{
    res.status(404).send("Problem in Adding the user");
  }

})
connectDB().then(()=>{
    console.log("Databse connected Succesfully");
    app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
}).catch((err)=>{
    console.log("Error While Connecting To DataBase");
});

