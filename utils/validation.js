const validator = require('validator');
const validateSingUpData =(req)=>{
    const{firstName,lastName, emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Please Enter The Name");
    }
    else if(firstName.length<4 || firstName.length>50){
        throw new Error("FirstName should be 4-50 character");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Not a valid Email Id");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("please Enter a Strong Password");
    }

};
const validateEditProfileData=(req)=>{
    const allowedEditFields =[
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "age",
        "about",
        "skills"
    ];
    const isEditAllowed = Object.keys(req.body).every((field)=>{
       return allowedEditFields.includes(field);
    });
    return isEditAllowed;

};

module.exports ={validateSingUpData,validateEditProfileData};