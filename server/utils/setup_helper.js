const db = require("../database/database");
const DatabaseTransaction = require("../database/transaction");
const DatabaseTask = require("../database/task");

class SetupHelper {

    static setup() {
        DatabaseTask.setupTask();
    }

}

module.exports = SetupHelper;