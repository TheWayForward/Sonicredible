const MessageHelper = require("../utils/message_helper");
const EnumHelper = require("../utils/enum_helper");

class ResponseHelper {

    static ok({message = MessageHelper.success, info}) {
        return {
            code: EnumHelper.HTTPStatus.OK,
            message: message,
            info: info
        }
    }

    static noContent({message = MessageHelper.do_not_exist, info}) {
        return {
            code: EnumHelper.HTTPStatus.NO_CONTENT,
            message: message,
            info: info
        }
    }

    static unauthorized({message = MessageHelper.token_expired, info}) {
        return {
            code: EnumHelper.HTTPStatus.UNAUTHORIZED,
            message: message,
            info: info
        }
    }

    static authorityUltraVires({message = MessageHelper.ultra_vires, info}) {
        return {
            code: EnumHelper.HTTPStatus.ULTRA_VIRES,
            message: message,
            info: info
        }
    }

    static error({message = MessageHelper.internal_error, info}) {
        return {
            code: EnumHelper.HTTPStatus.ERROR,
            message: message,
            info: info
        }
    }

}

module.exports = ResponseHelper;