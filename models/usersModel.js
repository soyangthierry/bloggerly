const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "User name is compulsory"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: [true,"Email is unique"],
        required: [true, "Email is required"],
        validate: [validator.isEmail,"Please enter a valid email"]
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8,"Password must be at least 8 characters long"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm password"],
        validate: {
            validator: function(val) {
                return val === this.password
            },
            message: "Passwords must match"
        }
    },
    changedPasswordAt: {
        type: Date
    },
    role: {
        type: String,
        enum:[ 'admin','user'],
        lowercase: true,
        default: 'user'
    },
    resetToken: String,
    resetTokenExp: Date
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {return next()}// works only on save and create
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined // since we no longer need this upon saving
    next()
})
userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew) {return next()}
    this.changedPasswordAt = Date.now() - 1000;
    next()
})
userSchema.methods.verifyPass = async function(candidatePass, actualPass) {
    return await bcrypt.compare(candidatePass,actualPass)
}
userSchema.methods.isPassowordChanged = function (tokenIat){
    if(this.changedPasswordAt){
        const changeTime = parseInt(this.changedPasswordAt.getTime()/1000,10);
        console.log(changeTime,tokenIat);
        if(tokenIat<changeTime){
            return true;
        }
        return false;
    }
}
userSchema.methods.createRecovery = function (){
    const tokenRaw = crypto.randomBytes(32).toString('hex');
    const tokenCrypt = crypto.createHash('sha256').update(tokenRaw).digest('hex');
    console.log(tokenRaw,tokenCrypt);
    this.resetToken = tokenCrypt;
    this.resetTokenExp = Date.now()+(10*60*1000);
    return tokenRaw;
}
const User = mongoose.model('User', userSchema);
module.exports = User;
