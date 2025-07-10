const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required:true,
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
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
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

const User =mongoose.model("User",userSchema);
module.exports = User;