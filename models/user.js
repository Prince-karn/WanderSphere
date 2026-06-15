const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },   
});

//add username and password to userSchema
userSchema.plugin(passportLocalMongoose);

//export the model
module.exports = mongoose.model("User", userSchema);


