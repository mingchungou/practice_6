
"use strict";

let mongoose = require("mongoose");
let app = require("./app.js");
let port = process.env.PORT || 9000;


mongoose.connect("mongodb://localhost:27017/mydb", (err, res) => {
    if (err) {
        throw err;
    } else {
        app.listen(port, () => {
            console.log("App listening on http://localhost:" + port);
        });
    }
});
