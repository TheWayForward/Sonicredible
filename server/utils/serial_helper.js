class SerialHelper {

    static generateAudioFileSerial() {
        let serial = '';
        for (let i = 0; i < 6; i++) {
            serial += Math.floor(Math.random() * 10);
        }
        return new Date().getTime() + serial;
    }

}

module.exports = SerialHelper;