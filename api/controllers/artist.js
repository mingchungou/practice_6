
"use strict";

let pagination = require("mongoose-pagination");
let mixin = require("../services/mixin");
let uploadedPath = "./uploads/artists/";

//Loading models
let Artist = require("../models/artist");
let Album = require("../models/album");
let Song = require("../models/song");


//Function for inserting an artist.
let insert = (req, res) => {
    let artist = new Artist();
    artist.name = req.body.name;
    artist.description = req.body.description;
    artist.image = null;

    if (!artist.name || !artist.description) {
        res.status(200).send({message: "Need to pass artist: name and description"});
    } else {
        artist.save((saveErr, artist) => {
            if (saveErr) {
                res.status(500).send({message: saveErr});
            } else if (!artist) {
                res.status(404).send({message: "Artist is not added successful"});
            } else {
                res.status(200).send({artist});
            }
        });
    }
};

//Function for getting an artist by id.
let get = (req, res) => {
    Artist.findById(req.params.id, (findErr, artist) => {
        if (findErr) {
            res.status(500).send({message: findErr});
        } else if (!artist) {
            res.status(404).send({message: "Artist is not existed"});
        } else {
            res.status(200).send({artist});
        }
    });
};

//Function for getting artists based on pagination number.
let getByPage = (req, res) => {
    let page = req.params.page || 1,
        itemsPerPage = 5;

    Artist.find().sort("name").paginate(page, itemsPerPage, (findErr, artists, total) => {
        if (findErr) {
            res.status(500).send({message: findErr});
        } else if (!artists || artists.length === 0) {
            res.status(404).send({message: "Artist is not found"});
        } else {
            let pages = Math.ceil(total / itemsPerPage);

            res.status(200).send({
                pages,
                artists
            });
        }
    });
};

//Function for updating an artist data by id.
let update = (req, res) => {
    if (!req.body.name || !req.body.description) {
        res.status(200).send({message: "Need to pass artist: name and description"});
    } else {
        Artist.findByIdAndUpdate(req.params.id, req.body, (updateErr, artist) => {
            if (updateErr) {
                res.status(500).send({message: updateErr});
            } else if (!artist) {
                res.status(404).send({message: "Artist is not updated successful"});
            } else {
                res.status(200).send({artist});
            }
        });
    }
};

//Function for removing an artist by id.
let remove = (req, res) => {
    Artist.findByIdAndRemove(req.params.id, (removeArtistErr, artist) => {
        if (removeArtistErr) {
            res.status(500).send({message: removeArtistErr});
        } else if (!artist) {
            res.status(404).send({message: "Artist is not removed successful"});
        } else {
            //Remove albums of artist.
            Album.find({artist: artist._id}, (findAlbumsErr, findAlbums) => {
                if (findAlbumsErr) {
                    res.status(500).send({message: findAlbumsErr});
                } else {
                    Album.remove({artist: artist._id}).exec((removeAlbumsErr, removeAlbumsResult) => {
                        if (removeAlbumsErr) {
                            res.status(500).send({message: removeAlbumsErr});
                        } else {
                            let album_id_array = [];

                            for (let album of findAlbums) {
                                album_id_array.push(album._id);
                            }

                            //Remove songs of artist albums.
                            Song.find({album: {$in: album_id_array}}).exec((findSongsErr, findSongs) => {
                                if (findSongsErr) {
                                    res.status(500).send({message: findSongsErr});
                                } else {
                                    Song.remove({album: {$in: album_id_array}}).exec((removeSongsErr, removeSongsResult) => {
                                        if (removeSongsErr) {
                                            res.status(500).send({message: removeSongsErr});
                                        } else {
                                            if (artist.image) {
                                                mixin.removeFile(uploadedPath + artist.image);
                                            }

                                            //Remove deleted album images.
                                            for (let album of findAlbums) {
                                                if (album.image) {
                                                    mixin.removeFile("./uploads/albums/" + album.image);
                                                }
                                            }

                                            //Remove deleted song images.
                                            for (let song of findSongs) {
                                                if (song.file) {
                                                    mixin.removeFile("./uploads/songs/" + song.file);
                                                }
                                            }

                                            res.status(200).send({artist});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

//Function for uploading an image to the artist by id.
let uploadImage = (req, res) => {
    req.uploadedPath = uploadedPath;
    let imageFile = mixin.validateImageFile(req, res);

    if (imageFile) {
        Artist.findByIdAndUpdate(req.params.id, {image: imageFile}, (updateErr, artist) => {
            if (updateErr) {
                mixin.removeFile(uploadedPath + imageFile);
                res.status(500).send({message: updateErr});
            } else if (!artist) {
                mixin.removeFile(uploadedPath + imageFile);
                res.status(404).send({message: "Artist is not updated successful"});
            } else {
                if (artist.image) {
                    mixin.removeFile(uploadedPath + artist.image);
                }

                res.status(200).send({
                    image: imageFile,
                    artist
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
    getByPage,
    update,
    remove,
    uploadImage,
    getImage
};
