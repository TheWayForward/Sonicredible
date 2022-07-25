const axios = require("axios");
const EnumHelper = require("./enum_helper");

class AjaxHelper {

    static ajax({url, headers, params, method}) {
        let promise;
        return new Promise((resolve, reject) => {
            if (method === EnumHelper.HTTPMethod.GET) {
                let queryString = "";
                Object.keys(params).forEach(key => {
                    queryString += key + "=" + params[key] + "&";
                });
                if (queryString !== "") {
                    queryString = queryString.substr(0, queryString.lastIndexOf("&"));
                }
                url += "?" + queryString;
                promise = axios.get(url, {headers: headers, params: params});
            } else if (method === EnumHelper.HTTPMethod.POST) {
                promise = axios.post(url, params, {headers: headers});
            }
            promise.then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            })
        });
    }

}

module.exports = AjaxHelper;