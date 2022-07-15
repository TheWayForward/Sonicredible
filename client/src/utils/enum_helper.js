class EnumHelper {

    static localStorageItem = {
        avatar: "avatar",
        realname: "realname",
        username: "username",
        user_id: "user_id",
        email: "email",
        nickname: "nickname",
        tel: "tel",
        token: "token",
        authority: "authority"
    }

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
        ERROR: 500
    }

    static formField = {
        avatar: "avatar",
        audio: "audio"
    }

    static imageType = {
        PNG: "image/png",
        JPG: "image/jpg",
        JPEG: "image/jpeg"
    }

    static audioType = {
        MP3: "audio/mpeg"
    }

}

export default EnumHelper;