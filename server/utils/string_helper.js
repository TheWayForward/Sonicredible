class StringHelper {

    static defaultSign = "这个人很懒，TA什么也没有说";

    static directoryRevision(directory) {
        return directory.replace(/\\/g, "/");
    }

    static boolToNumber(bool) {
        return (bool) => bool ? 1 : 0;
    }

}

module.exports = StringHelper;