const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Create schema
const userSchema = new Schema({
    email: {type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: {type: String, required: true, minlength: [4, 'password must be atleast 4 characters long']},
    contactNum: {type: String, required: true}
});

userSchema.path('email').validate((val) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(val);
}, 'Invalid email');

userSchema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password, 10);
}

userSchema.methods.isValid = function(hashedPassword){
    return bcrypt.compareSync(hashedPassword,this.password);
}

//Create collection and add schema
module.exports = mongoose.model('users', userSchema);