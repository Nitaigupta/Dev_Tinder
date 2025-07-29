const express = require('express');
const { userAuth } = require('../middleware/auth');
const profileRouter = express.Router();
const User = require("../models/User");
const{validateEditProfileData} = require('../utils/validation')

profileRouter.get('/profile/view',userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error"+ err.message);
    }
});
profileRouter.patch('/profile/edit', userAuth , async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser= req.user;
       Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
       await loggedInUser.save();
       res.json({
        message:`${loggedInUser.firstName} your profile was Updated Successfully`,
        data:loggedInUser
       })

        
    }
    catch(err){
        res.status(400).send("Error :"+err.message);
    }
})
profileRouter.patch('/profile/password',userAuth,async(req,res)=>{
    res.send("Abhi Bana hai");

})

module.exports = profileRouter;