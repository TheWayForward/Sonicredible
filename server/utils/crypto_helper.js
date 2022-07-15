const aes = require("aes-js");

class CryptoHelper {

    static #key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    static aesEncrypt(text) {
        let textBytes = aes.utils.utf8.toBytes(text);
        let aesCtr = new aes.ModeOfOperation.ctr(this.#key, new aes.Counter(5));
        let encryptedBytes = aesCtr.encrypt(textBytes);
        return aes.utils.hex.fromBytes(encryptedBytes);
    }

    static aesDecrypt(text) {
        let encryptedBytes = aes.utils.hex.toBytes(text);
        let aesCtr = new aes.ModeOfOperation.ctr(this.#key, new aes.Counter(5));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        return aes.utils.utf8.fromBytes(decryptedBytes);
    }

}

module.exports = CryptoHelper;