const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName :{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a Valid Email"+value);
            }
        }
    },
    password:{
        type:String,
        required:true,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password"+value);
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        // validate(value){
        //     if(!["male","female","other"].includes(value)){
        //         throw new Error("Gender data is not valid");
        //     }
        // }
        enum:{
            values:["male","female","other"],
            message:`{VALUE} is not valid genger type`
        }
    },
    photoUrl:{
        type:String,
        default:"https://ongcvidesh.com/wp-content/uploads/2019/08/dummy-image.jpg",
         validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a Valid Photo URL"+value);
            }
        }

    },
    about:{
        type:String,
        default:"This is default about the user!"

    },
    skills:{
        type:[String]

    }

},{
    timestamps:true,
});
userSchema.methods.getJWT = async function(){
    const user = this;
    const token= await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"7d"});
    return token;
};
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}
const User =mongoose.model("User",userSchema);
module.exports = User;