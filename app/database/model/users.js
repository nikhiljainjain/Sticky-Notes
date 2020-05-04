let mongoose = require("mongoose");

let user = new mongoose.Schema({
	//full name
    name: { 
        type: String, 
        default: "Mr. X",
        trim: true, 
    },
	//email id
	email: { 
        type: String, 
        default: "example@email.com", 
        unique: true,
        trim: true
    },
    //gender of the user value should be either m or f
    gender: {
        type: String,
        default: "M",
        trim: true
    },
	//password
    password: { 
        type: String, 
        default: null,
        select: false 
    },
    //cookie
    cookie: { 
        type: String, 
        default: null,
        select: false 
    },
    //register time
    registerTime: { 
        type: Date, 
        default: Date.now,
        select: false 
    },
    //email verification code (code valid for 48 hours after generation)
    verificationCode: { 
        type: String, 
        default: null,
        select: false 
    },
    //email send
    emailSend: {
        type: Boolean,
        default: false,
        select: false
    },
    //user verified
    verified: { 
        type: Boolean, 
        default: false,
        select: false 
    },
    //registering ip addres
    registerIP: {
        type: String,
        default: null,
        select: false
    },
	//notes id
	notes: [
        { 
            type: mongoose.Schema.ObjectId, 
            ref: 'njnotes' 
        }
    ],
    //active status of user or we are not premitted the user
    activeStatus:{
        type: Boolean, 
        default: true,
        select: false
    }
});

module.exports = mongoose.model('njnotesusers', user);