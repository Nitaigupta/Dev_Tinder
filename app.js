const express = require('express');
const connectDB = require('./config/database');
require("./config/database")
const app = express();
const User = require("./models/User")

app.use(express.json());

app.post('/signup', async (req,res)=>{
  
  //creating a new instance of user model
  const user = new User(req.body);
  try{
    await user.save();
  res.send("user Added");
  }
  catch(err){
    res.status(400).send("Error saving the user:"+ err.message);
  }

});

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


connectDB().then(()=>{
    console.log("Databse connected Succesfully");
    app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
}).catch((err)=>{
    console.log("Error While Connecting To DataBase");
});

