const fs = require("fs");
const Path = require("path");
const mimetype = require("mime-types");
const path = require("path");
const ffmpeg = require("ffmpeg");
const EnumHelper = require("./enum_helper");

class FileHelper {

    static pathParse(directory) {
        let pos = directory.lastIndexOf('/');
        return {
            fileName: directory.substr(pos + 1),
            rawName: directory.substr(pos + 1).substr(0, directory.substr(pos + 1).lastIndexOf(".")),
            url: directory.substr(0, pos),
            extension: directory.substr(directory.lastIndexOf(".") + 1)
        };
    }

    static wavToMp3(directory) {
        let directoryData = FileHelper.pathParse(directory);
        let wavFilePath = Path.resolve(directory);
        let process = new ffmpeg(wavFilePath);
        return new Promise((resolve, reject) => {
            process.then(function (audio) {
                audio.fnExtractSoundToMP3(`${EnumHelper.directory.audios.convert}/${directoryData.rawName}.mp3`, function (err, file) {
                    if (!err) {
                        resolve(file);
                    } else {
                        reject(err);
                    }
                });
            });
        });
    }

    static fileToBase64(directory) {
        let data = fs.readFileSync(Path.resolve(directory));
        return Buffer.from(data).toString("base64");
        // full base64 string
        // return 'data:' + mimetype.lookup(filePath) + ';base64,' + Buffer.from(data).toString("base64");
    }

}

module.exports = FileHelper;