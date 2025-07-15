const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    isHost: { type: Boolean, default: false },
    phone: String,
    experience: String,
    idType: String,
    idNumber: String,
    bio: String,

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);


// .plugin is used to add extra properties or attributes to the schema
//by adding passportlocalmongoose as a plugin , it adds 3 properties to the scehma itself
// username , hash and salt
// we use salt so that even a commmon password entered by th user after mixed with
//the salt string , it becomes unique and hence secure
// other than these fields the pasasport adds some methods to our model
// like authenticate , serialize compare etc ,after exporting the model you can use them anywhere
