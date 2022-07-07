const Config = require("../config");
const DatabaseTransaction = require("./database_transaction");
const SQL = require("./sql");
const StatusHelper = require("../utils/status_helper");
const TimeHelper = require("../utils/time_helper");

const default_task_time = 3000;

module.exports = {
    task_test: () => {
    },

    setupTask: () => {
        console.log("Database Task: Executing setup task")
    }
};