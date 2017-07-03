
"use strict";

let mongoose = require("mongoose");
let songSchema = mongoose.Schema({
    number: Number,
    name: String,
    duration: String,
    file: String,
    album: {type: mongoose.Schema.ObjectId, ref: "album"}
});


module.exports = mongoose.model("song", songSchema);
