const express = require('express');
const { userAuth } = require('../middleware/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/User');
const mongoose = require('mongoose');



requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid Status Type" + status});
        }
        if(fromUserId==toUserId){
            return res.status(400).json({message: "Invalid Connection Request"});
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not Found"});
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).send({message:"Connection Request Already Exsists!!"})
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({
            message:req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        });

    }
    catch(err){
        res.status(400).send("Error"+err.message);

    }
   


});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
   const status =req.params.status;
   const requestId = req.params.requestId;
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

  const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ message: `Connection request ${status}`, data });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});






module.exports = requestRouter;