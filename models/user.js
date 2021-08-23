const mongoose = require('mongoose');
const validator = require('validator')

const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
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
module.exports = mongoose.model("User",UserSchema);