const Config = require("../config");
const DatabaseTransaction = require("./transaction");
const SQL = require("./sql");
const StatusHelper = require("../utils/enum_helper");
const TimeHelper = require("../utils/time_helper");

const default_task_time = 3000;

module.exports = {
    task_test: () => {
    },

    setupTask: () => {
        console.log("Database Task: Executing setup task")
    }
};