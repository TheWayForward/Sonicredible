class UserModel {

    #id;
    #nickname;
    #username;
    #password;

    constructor({id = 0, nickname = "", username = "", password = ""}) {
        this.#id = id;
        this.#nickname = nickname;
        this.#username = username;
        this.#password = password;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get nickname() {
        return this.#nickname;
    }

    set nickname(value) {
        this.#nickname = value;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get password() {
        return this.#password;
    }

    set password(value) {
        this.#password = value;
    }

    toJSON() {
        return {
            id: this.#id,
            nickname: this.#nickname,
            username: this.#username,
            password: this.#password
        }
    }
}