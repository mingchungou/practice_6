
"use strict";

let express = require("express");
let songController = require("../controllers/song");
let api = express.Router();
let multiparty = require("connect-multiparty");

//Loading middlewares
let md_auth = require("../middlewares/authentication");
let md_upload = multiparty({uploadDir: "./uploads/songs"});


api.get("/get/:id", md_auth.ensureAuth, songController.get);
api.get("/getAll/:album?", md_auth.ensureAuth, songController.getAll);
api.get("/getSong/:file", songController.getSong);

api.post("/insert", md_auth.ensureAuth, songController.insert);
api.post("/uploadSong/:id", [md_auth.ensureAuth, md_upload], songController.uploadSong);

api.put("/update/:id", md_auth.ensureAuth, songController.update);

api.delete("/remove/:id", md_auth.ensureAuth, songController.remove);


module.exports = api;
