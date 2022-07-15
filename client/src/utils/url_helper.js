import Config from "../utils/config";

class UrlHelper {

    static parseUrl(url) {
        if (url.substr(0, 7) === "http://" || url.substr(0, 8) === "https://") return url;
        return `${Config.BASE_URL}${url}`;
    }

    static redoUrl(url) {
        if (url.substr(0, 7) === "http://" || url.substr(0, 8) === "https://") {
            return url.substr(Config.BASE_URL.length);
        }
        return url;
    }

}

export default UrlHelper;