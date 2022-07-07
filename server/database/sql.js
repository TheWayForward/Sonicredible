const Config = require("../config");
const StatusHelper = require("../utils/status_helper");

class SQL {
    static generateSQL(sql, params) {
        return {
            sql,
            params
        }
    }

    static selectById({table_name, id}) {
        return `SELECT * FROM ${table_name} WHERE id = ${id}`;
    }
}

module.exports = SQL;