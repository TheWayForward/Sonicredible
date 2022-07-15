import Config from "./config";
import lodash from "lodash";

class VersatileHelper {

    static generateAddressString(address) {
        let address_string = address.province;
        if (address.hasOwnProperty("region")) {
            address_string += ` ${address.region}`;
        }
        if (address.hasOwnProperty("district")) {
            address_string += ` ${address.district}`;
        }
        let address_detail_string = address_string + ` ${address.detail}`;
        return {
            address_string: address_string,
            address_detail_string: address_detail_string
        };
    }

    static copyContent(content) {
        let temp = document.createElement('input');
        temp.setAttribute('value', content);
        document.body.appendChild(temp);
        temp.select();
        let result = document.execCommand('copy');
        document.body.removeChild(temp);
        return result;
    }

    static byteToSize(byte) {
        return byte / (1024 * 1024);
    }
}

export default VersatileHelper;