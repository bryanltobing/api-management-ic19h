const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    }
});

const userModel = mongoose.model('users', userSchema);
module.exports =  {
    userModel
}



