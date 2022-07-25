class EnumHelper {

    static authorityType = {
        root: "root",
        manager: "manager",
        user: "user"
    };

    static HTTPMethod = {
        GET: "GET",
        HEAD: "HEAD",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
        CONNECT: "CONNECT",
        OPTIONS: "OPTIONS",
        TRACE: "TRACE",
        PATCH: "PATCH"
    };

    static HTTPStatus = {
        OK: 200,
        NO_CONTENT: 204,
        UNAUTHORIZED: 401,
        ULTRA_VIRES: 403,
        ERROR: 500
    };

    static formField = {
        avatar: "avatar",
        audio: "audio"
    };

    static imageType = {
        PNG: "image/png",
        JPG: "image/jpg",
        JPEG: "image/jpeg"
    };

    static audioType = {
        MP3: "audio/mpeg"
    };

    static databaseException = {
        ER_DUP_ENTRY: "ER_DUP_ENTRY"
    };

    static networkException = {
        ECONNREFUSED: "ECONNREFUSED"
    };

    static directory = {
        images: {
            avatar: "public/images/avatar",
        },
        audios: {
            recognition: "public/audios/recognition",
            voiceprint: "public/audios/voiceprint"
        }
    };

}

module.exports = EnumHelper;
