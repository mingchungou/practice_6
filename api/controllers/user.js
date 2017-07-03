
"use strict";

let bcrypt = require("bcrypt-nodejs");
let jwt = require("../services/jwt");
let mixin = require("../services/mixin");
let uploadedPath = "./uploads/users/";

//Loading models
let User = require("../models/user");


//Function for getting an user by whatever.
let getUserByAttr = attrs => {
    return new Promise((resolve, reject) => {
        User.findOne(attrs, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

//Function for inserting an user.
let insert = (req, res) => {
    let user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email.toLowerCase();
    user.role = req.body.role;
    user.image = null;

    if (!user.name || !user.username || !user.email || !req.body.password) {
        res.status(500).send({message: "Need to pass user: name, username, email and password"});
    } else {
        getUserByAttr({email: user.email}).then(data => {
            if (data) {
                res.status(500).send({message: "User is already existed"});
            } else {
                //Encrypting password
                bcrypt.hash(req.body.password, null, null, (bcryptErr, hash) => {
                    if (bcryptErr) {
                        res.status(500).send({message: bcryptErr});
                    } else {
                        user.password = hash;
                        user.save((saveErr, saveUser) => {
                            if (saveErr) {
                                res.status(500).send({message: saveErr});
                            } else if (!saveUser) {
                                res.status(404).send({message: "User is not added successful"});
                            } else {
                                res.status(200).send({user: saveUser});
                            }
                        });
                    }
                });
            }
        }, getUserErr => res.status(500).send({message: getUserErr}));
    }
};

//Function for checking if user exists.
let login = (req, res) => {
    getUserByAttr({email: req.body.email.toLowerCase()}).then(user => {
        if (!user) {
            res.status(404).send({message: "User is not existed"});
        } else {
            //Checking user password
            bcrypt.compare(req.body.password, user.password, (bcryptErr, check) => {
                if (bcryptErr) {
                    res.status(500).send({message: bcryptErr});
                } else if (!check) {
                    res.status(404).send({message: "User data is not correct"});
                } else {
                    if (req.body.gethash) { //Return a token
                        res.status(200).send({token: jwt.createToken(user)});
                    } else { //Return user data
                        res.status(200).send({user});
                    }
                }
            });
        }
    }, getUserErr => res.status(500).send({message: getUserErr}));
};

//Function for updating an user data by id.
var update = (req, res) => {
    if (req.params.id !== req.user.sub) {
        res.status(500).send({message: "Don't have permission to update this user"});
    } else if (!req.body.name || !req.body.username || !req.body.email) {
        res.status(500).send({message: "Need to pass user: name, username and email"});
    } else {
        User.findByIdAndUpdate(req.params.id, req.body, (updateErr, user) => {
            if (updateErr) {
                res.status(500).send({message: updateErr});
            } else if (!user) {
                res.status(404).send({message: "User is not updated successful"});
            } else {
                res.status(200).send({user});
            }
        });
    }
};

//Function for uploading an image to the user by id.
var uploadImage = (req, res) => {
    if (req.params.id !== req.user.sub) {
        res.status(500).send({message: "Don't have permission to update this user"});
    } else {
        req.uploadedPath = uploadedPath;
        let imageFile = mixin.validateImageFile(req, res);

        if (imageFile) {
            User.findByIdAndUpdate(req.params.id, {image: imageFile}, (updateErr, user) => {
                if (updateErr) {
                    mixin.removeFile(uploadedPath + imageFile);
                    res.status(500).send({message: updateErr});
                } else if (!user) {
                    mixin.removeFile(uploadedPath + imageFile);
                    res.status(404).send({message: "User is not updated successful"});
                } else {
                    if (user.image) {
                        mixin.removeFile(uploadedPath + user.image);
                    }

                    res.status(200).send({
                        image: imageFile,
                        user
                    });
                }
            });
        }
    }
};

//Function for loading an image.
var getImage = (req, res) => {
    req.uploadedPath = uploadedPath;

    mixin.getFile(req, res);
};


module.exports = {
    insert,
    login,
    update,
    uploadImage,
    getImage
};
