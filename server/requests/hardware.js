const AjaxHelper = require("../utils/ajax_helper");
const EnumHelper = require("../utils/enum_helper");

const BASE_URL = "http://127.0.0.1:3001";

class HardwareRequest {

    static excute = (command_content) => AjaxHelper.ajax({
        url: `${BASE_URL}/hardware/execute`,
        params: {
            command_content: command_content
        },
        method: EnumHelper.HTTPMethod.POST
    });

}

module.exports = HardwareRequest;