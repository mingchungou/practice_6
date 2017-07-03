
"use strict";

let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let cors = require("cors");

//Loading routes
let userRoute = require("./routes/user");
let artistRoute = require("./routes/artist");
let albumRoute = require("./routes/album");
let songRoute = require("./routes/song");


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use("/user", userRoute);
app.use("/artist", artistRoute);
app.use("/album", albumRoute);
app.use("/song", songRoute);


module.exports = app;
