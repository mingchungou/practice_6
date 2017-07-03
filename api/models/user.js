
"use strict";

let mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    role: String,
    image: String
});


module.exports = mongoose.model("user", userSchema);
