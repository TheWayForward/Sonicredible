module.exports = {
    directory_revision: (directory) => directory.replace(/\\/g, "/"),

    bool_to_number: (bool) => bool ? 1 : 0,

    default_sign: "这个人很懒，TA什么也没有说"
};