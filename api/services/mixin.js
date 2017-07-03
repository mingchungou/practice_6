
"use strict";

let fs = require("fs");
let path = require("path");


//Function for removing an uploaded file.
let removeFile = uploadedFilePath => {
    fs.exists(uploadedFilePath, exists => {
        if (exists) {
            fs.unlink(uploadedFilePath);
        }
    });
};

//Function for checking if the file sent is an image.
let validateImageFile = (req, res) => {
    if (!req.files) {
        res.status(500).send({message: "Need to pass an image file"});
    } else {
        let filePath = req.files.image.path, //Get file path.
            fileName = filePath.split("\/")[2], //Get file name.
            fileExt = fileName.split("\.")[1]; //Get file extension.

        //Check if the file is an image.
        if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "gif" && fileExt !== "svg") {
            removeFile(req.uploadedPath + fileName);
            res.status(500).send({message: "Got an invalid image file"});
        } else {
            return fileName;
        }
    }
};

//Function for checking if the file sent is a song.
let validateSongFile = (req, res, uploadedPath) => {
    if (!req.files) {
        res.status(500).send({message: "Need to pass a song file"});
    } else {
        let filePath = req.files.song.path, //Get file path.
            fileName = filePath.split("\/")[2], //Get file name.
            fileExt = fileName.split("\.")[1]; //Get file extension.

        //Check if the file is a song.
        if (fileExt !== "mp3" && fileExt !== "mp4" && fileExt !== "ogg") {
            removeFile(uploadedPath + fileName);
            res.status(500).send({message: "Got an invalid song file"});
        } else {
            return fileName;
        }
    }
};

//Function for loading a file from server.
let getFile = (req, res) => {
    let filePath = req.uploadedPath + req.params.file;

    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({message: "The file is not found successful"});
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
};


module.exports = {
    removeFile,
    validateImageFile,
    validateSongFile,
    getFile
};
