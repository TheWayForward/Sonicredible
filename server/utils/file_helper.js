const fs = require("fs");
const Path = require("path");
const mimetype = require("mime-types");

class FileHelper {

    static fileToBase64(directory) {
        let filePath = Path.resolve(directory);
        let data = fs.readFileSync(filePath);
        // raw base64 string
        return Buffer.from(data).toString("base64");
        // full base64 string
        // return 'data:' + mimetype.lookup(filePath) + ';base64,' + Buffer.from(data).toString("base64");
    }

}

module.exports = FileHelper;