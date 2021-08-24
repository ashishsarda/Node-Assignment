const mongoose = require('mongoose');
const validator = require('validator')//validate different input data

const passportLocalMongoose = require("passport-local-mongoose");//mongoose plugin for simplified username and password
const UserSchema = new mongoose.Schema({ //Creating the user structure and it's attributes
    fname:{
        type:String,
        required:true,
        trim:true
    },
    lname:{
            type:String,
            required:true,
            trim:true
    },
    username:{
        type:String,
        required:true,
        trim:true,
        // validate(value){
        //     if(!validator.isusername(value)){
        //         throw new Error('Username is already taken')
        //     }
        // }
    },
    password:{
        type:String,
        trim:true
    },
    phone:{
        type:Number,
        required:true
    },birth:Date
}) ;
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);//Exporting the User module to be used in other files.