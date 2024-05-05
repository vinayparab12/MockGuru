const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    phone_no : {
        type:Number,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    cpassword : {
        type:String,
        required:true
    },
    answersAttempts: {
        type: Number,
        default: 0
    },
    interviewAttempts: {
        type: Number,
        default: 0
    },
    tokens:[
        {
            token: {
                type:String,
                required:true
            }
        }
    ]
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({_id:this._id}, process.env.SECRETE_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch(err) {
        console.log(err);
    }
};

// Middleware to update interviewAttempts when three answers are given
userSchema.pre('save', async function (next) {
    if (this.isModified('answersAttempts')) {
        if (this.answersAttempts % 3 === 0) {
            this.interviewAttempts = this.answersAttempts / 3; // Update interviewAttempts directly
        }
    }
    next();
});

const User = mongoose.model('userinterface', userSchema);

module.exports = User;
