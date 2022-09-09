import utils.message_helper as MessageHelper
import utils.convert_helper as ConvertHelper

def responseOK(info, message=MessageHelper.success):
    return {
        "code": 200,
        "message": message,
        "info": info
    }


def responseERROR(message=MessageHelper.success):
    return {
        "code": 500,
        "message": message,
    }
