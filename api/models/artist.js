
"use strict";

let mongoose = require("mongoose");
let artistSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String
});


module.exports = mongoose.model("artist", artistSchema);
