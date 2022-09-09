const Config = require("../config");

class UrlHelper {

    static parseUrl(url) {
        if (url.substr(0, 7) === "http://" || url.substr(0, 8) === "https://") return url;
        return `${Config.base_url}${url}`;
    }

    static redoUrl(url) {
        if (url.substr(0, 7) === "http://" || url.substr(0, 8) === "https://") {
            return url.substr(Config.base_url.length);
        }
        return url;
    }

}

module.exports = UrlHelper;