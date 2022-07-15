const db = require("../database/database");
const DatabaseTransaction = require("../database/database_transaction");
const DatabaseTask = require("../database/database_task");

class SetupHelper {

    static setup() {
        DatabaseTask.setupTask();
    }

}

module.exports = SetupHelper;