
"use strict";

let express = require("express");
let userController = require("../controllers/user");
let api = express.Router();
let multiparty = require("connect-multiparty");

//Loading middlewares
let md_auth = require("../middlewares/authentication");
let md_upload = multiparty({uploadDir: "./uploads/users"});


api.get("/getImage/:file", userController.getImage);

api.post("/insert", userController.insert);
api.post("/login", userController.login);
api.post("/uploadImage/:id", [md_auth.ensureAuth, md_upload], userController.uploadImage);

api.put("/update/:id", md_auth.ensureAuth, userController.update);


module.exports = api;
