
"use strict";

let mixin = require("../services/mixin");
let uploadedPath = "./uploads/albums/";

//Loading models
let Album = require("../models/album");
let Song = require("../models/song");


//Function for inserting an album.
let insert = (req, res) => {
    let album = new Album();
    album.title = req.body.title;
    album.description = req.body.description;
    album.year = req.body.year;
    album.image = null;
    album.artist = req.body.artist;

    if (!album.title || !album.description || !album.year || !album.artist) {
        res.status(200).send({message: "Need to pass album: title, description, year and artist"});
    } else {
        album.save((saveErr, album) => {
            if (saveErr) {
                res.status(500).send({message: saveErr});
            } else if (!album) {
                res.status(404).send({message: "Album is not added successful"});
            } else {
                res.status(200).send({album});
            }
        });
    }
};

//Function for getting an album by id.
let get = (req, res) => {
    Album.findById(req.params.id).populate({path: "artist"}).exec((findErr, album) => {
        if (findErr) {
            res.status(500).send({message: findErr});
        } else if (!album) {
            res.status(404).send({message: "Album is not found"});
        } else {
            res.status(200).send({album});
        }
    });
};

//Function for getting all albums or specific artist albums.
var getAll = (req, res) => {
    let find;

    if (!req.params.artist) {
        find = Album.find().sort("title");
    } else {
        find = Album.find({artist: req.params.artist}).sort("year");
    }

    find.populate({path: "artist"}).exec((findErr, albums) => {
        if (findErr) {
            res.status(500).send({message: findErr});
        } else if (!albums || albums.length === 0) {
            res.status(404).send({message: "Album is not found"});
        } else {
            res.status(200).send({albums});
        }
    });
};

//Function for updating an album data by id.
let update = (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.year) {
        res.status(200).send({message: "Need to pass album: title, description and year"});
    } else {
        Album.findByIdAndUpdate(req.params.id, req.body, (updateErr, album) => {
            if (updateErr) {
                res.status(500).send({message: updateErr});
            } else if (!album) {
                res.status(404).send({message: "Album is not updated successful"});
            } else {
                res.status(200).send({album});
            }
        });
    }
};

//Function for removing an album by id.
let remove = (req, res) => {
    Album.findByIdAndRemove(req.params.id, (removeAlbumErr, album) => {
        if (removeAlbumErr) {
            res.status(500).send({message: removeAlbumErr});
        } else if (!album) {
            res.status(404).send({message: "Album is not removed successful"});
        } else {
            //Remove songs of album.
            Song.find({album: album._id}, (findSongsErr, findSongs) => {
                if (findSongsErr) {
                    res.status(500).send({message: findSongsErr});
                } else {
                    Song.remove({album: album._id}, (removeSongsErr, removeSongsResult) => {
                        if (removeSongsErr) {
                            res.status(500).send({message: removeSongsErr});
                        } else {
                            if (album.image) {
                                mixin.removeFile(uploadedPath + album.image);
                            }

                            //Remove deleted song images.
                            for (let song of findSongs) {
                                if (song.file) {
                                    mixin.removeFile("./uploads/songs/" + song.file);
                                }
                            }

                            res.status(200).send({album});
                        }
                    });
                }
            });
        }
    });
};

//Function for uploading an image to the album by id.
let uploadImage = (req, res) => {
    req.uploadedPath = uploadedPath;
    let imageFile = mixin.validateImageFile(req, res);

    if (imageFile) {
        Album.findByIdAndUpdate(req.params.id, {image: imageFile}, (updateErr, album) => {
            if (updateErr) {
                mixin.removeFile(uploadedPath + imageFile);
                res.status(500).send({message: updateErr});
            } else if (!album) {
                mixin.removeFile(uploadedPath + imageFile);
                res.status(404).send({message: "Album is not updated successful"});
            } else {
                if (album.image) {
                    mixin.removeFile(uploadedPath + album.image);
                }

                res.status(200).send({
                    image: imageFile,
                    album
                });
            }
        });
    }
};

//Function for loading an image.
let getImage = (req, res) => {
    req.uploadedPath = uploadedPath;

    mixin.getFile(req, res);
};


module.exports = {
    insert,
    get,
    getAll,
    update,
    remove,
    uploadImage,
    getImage
};
