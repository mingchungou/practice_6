
"use strict";

let express = require("express");
let artistController = require("../controllers/artist");
let api = express.Router();
let multiparty = require("connect-multiparty");

//Loading middlewares
let md_auth = require("../middlewares/authentication");
let md_upload = multiparty({uploadDir: "./uploads/artists"});


api.get("/get/:id", md_auth.ensureAuth, artistController.get);
api.get("/getByPage/:page?", md_auth.ensureAuth, artistController.getByPage);
api.get("/getImage/:file", artistController.getImage);

api.post("/insert", md_auth.ensureAuth, artistController.insert);
api.post("/uploadImage/:id", [md_auth.ensureAuth, md_upload], artistController.uploadImage);

api.put("/update/:id", md_auth.ensureAuth, artistController.update);

api.delete("/remove/:id", md_auth.ensureAuth, artistController.remove);


module.exports = api;
