const AjaxHelper = require("../utils/ajax_helper");
const EnumHelper = require("../utils/enum_helper");

const HARDWARE_BASE_URL = "http://127.0.0.1:3001";
const SERVICE_BASE_URL = "http://127.0.0.1:8000";

class HardwareRequest {

    static execute = (command_content) => AjaxHelper.ajax({
        url: `${HARDWARE_BASE_URL}/hardware/execute`,
        params: {
            command_content: command_content
        },
        method: EnumHelper.HTTPMethod.POST
    });

}

class VoiceprintContrastRequest {

    static execute = ({user_voiceprint_url, target_voice_url}) => AjaxHelper.ajax({
        url: `${SERVICE_BASE_URL}/sonicredible/voiceprint_contrast`,
        params: {
            user_voiceprint_url: user_voiceprint_url,
            target_voice_url: target_voice_url
        },
        method: EnumHelper.HTTPMethod.POST
    });

}


module.exports = {HardwareRequest, VoiceprintContrastRequest};