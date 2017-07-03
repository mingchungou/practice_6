
"use strict";

let mixin = require("../services/mixin");
let uploadedPath = "./uploads/songs/";

//Loading models
let Song = require("../models/song");


//Function for inserting a song.
let insert = (req, res) => {
    let song = new Song();
    song.number = req.body.number;
    song.name = req.body.name;
    song.duration = req.body.duration;
    song.file = null;
    song.album = req.body.album;

    if (!song.number || !song.name || !song.duration || !song.album) {
        res.status(200).send({message: "Need to pass song: number, name, duration and album"});
    } else {
        song.save((saveErr, song) => {
            if (saveErr) {
                res.status(500).send({message: saveErr});
            } else if (!song) {
                res.status(404).send({message: "Song is not added successful"});
            } else {
                res.status(200).send({song});
            }
        });
    }
};

//Function for getting a song by id.
let get = (req, res) => {
    Song.findById(req.params.id).populate({path: "album"}).exec((findErr, song) => {
        if (findErr) {
            res.status(500).send({message: findErr});
        } else if (!song) {
            res.status(404).send({message: "Song is not found"});
        } else {
            res.status(200).send({song});
        }
    });
};

//Function for getting all songs or specific album songs.
let getAll = (req, res) => {
    let find;

    if (!req.params.album) {
        find = Song.find().sort({"album": 1, "number": 1});
    } else {
        find = Song.find({album: req.params.album}).sort("number");
    }

    find.populate({path: "album"}).exec((findErr, songs) => {
        if (findErr) {
            res.status(500).send({message: findErr});
        } else if (!songs || songs.length === 0) {
            res.status(404).send({message: "Song is not found"});
        } else {
            res.status(200).send({songs});
        }
    });
};

//Function for updating a song data by id.
let update = (req, res) => {
    if (!req.body.name || !req.body.duration) {
        res.status(200).send({message: "Need to pass song: name and duration"});
    } else {
        Song.findByIdAndUpdate(req.params.id, req.body, (updateErr, song) => {
            if (updateErr) {
                res.status(500).send({message: updateErr});
            } else if (!song) {
                res.status(404).send({message: "Song is not updated successful"});
            } else {
                res.status(200).send({song});
            }
        });
    }
};

//Function for removing a song by id.
let remove = (req, res) => {
    Song.findByIdAndRemove(req.params.id, (removeErr, song) => {
        if (removeErr) {
            res.status(500).send({message: removeErr});
        } else if (!song) {
            res.status(404).send({message: "Song is not removed successful"});
        } else {
            if (song.file) {
                mixin.removeFile(uploadedPath + song.file)
            }

            res.status(200).send({song});
        }
    });
};

//Function for uploading a song to the song by id.
let uploadSong = (req, res) => {
    req.uploadedPath = uploadedPath;
    let songFile = mixin.validateSongFile(req, res, uploadedPath);

    if (songFile) {
        Song.findByIdAndUpdate(req.params.id, {file: songFile}, (updateErr, song) => {
            if (updateErr) {
                mixin.removeFile(uploadedPath + songFile);
                res.status(500).send({message: updateErr});
            } else if (!song) {
                mixin.removeFile(uploadedPath + songFile);
                res.status(404).send({message: "Song is not updated successful"});
            } else {
                if (song.file) {
                    mixin.removeFile(uploadedPath + song.file);
                }

                res.status(200).send({
                    file: songFile,
                    song
                });
            }
        });
    }
};

//Function for loading a song.
let getSong = (req, res) => {
    req.uploadedPath = uploadedPath;

    mixin.getFile(req, res);
};


module.exports = {
    insert,
    get,
    getAll,
    update,
    remove,
    uploadSong,
    getSong
};
