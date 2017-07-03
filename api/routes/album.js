
"use strict";

let express = require("express");
let albumController = require("../controllers/album");
let api = express.Router();
let multiparty = require("connect-multiparty");

//Loading middlewares
let md_auth = require("../middlewares/authentication");
let md_upload = multiparty({uploadDir: "./uploads/albums"});


api.get("/get/:id", md_auth.ensureAuth, albumController.get);
api.get("/getAll/:artist?", md_auth.ensureAuth, albumController.getAll);
api.get("/getImage/:file", albumController.getImage);

api.post("/insert", md_auth.ensureAuth, albumController.insert);
api.post("/uploadImage/:id", [md_auth.ensureAuth, md_upload], albumController.uploadImage);

api.put("/update/:id", md_auth.ensureAuth, albumController.update);

api.delete("/remove/:id", md_auth.ensureAuth, albumController.remove);


module.exports = api;
