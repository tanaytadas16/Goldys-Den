var fs = require("fs"),
    gm = require("gm");

var dir = __dirname + "/imgs";
function createImage(text) {
    gm(150, 100, "#84defaaa")
        .fontSize(68)
        .stroke("#efe", 3)
        .fill("#000000")
        .drawText(20, 72, text)
        .write(dir + "/initials.png", function (err) {
            if (err) return console.dir(arguments);
            console.log(this.outname + " created  :: " + arguments[3]);
        });
}

module.exports = {
    createImage,
};
