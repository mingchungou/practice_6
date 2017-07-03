
"use strict";

let mongoose = require("mongoose");
let albumSchema = mongoose.Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: {type: mongoose.Schema.ObjectId, ref: "artist"}
});


module.exports = mongoose.model("album", albumSchema);
