const Config = require("../config");
const StatusHelper = require("../utils/enum_helper");
const ObjectHelper = require("../utils/object_helper");

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

    static select({table_name, condition = ""}) {
        return `SELECT * FROM ${table_name} ${condition}`;
    }

    static count({table_name, condition = ""}) {
        return `SELECT COUNT(*) as count FROM ${table_name} ${condition}`;
    }

    static insert({table_name, params}) {
        let objectToInsert = this.#objectToInsert(params);
        return `INSERT INTO ${table_name} (${objectToInsert.fieldString}) VALUES (${objectToInsert.placeholderString})`;
    }

    static update({table_name, params, condition = ""}) {
        return `UPDATE ${table_name} SET ${this.#objectToUpdate(params)} ${condition}`;
    }

    static fuzzySearch({keyword, table_name, fields = "*", column, condition = ""}) {
        keyword = keyword.replace(/\s+/g, ' ');
        keyword = keyword.replace(/(^\s*)|(\s*$)/g, '');
        let key_array = keyword.split(' ');
        let sql = `SELECT ${fields} FROM ${table_name} WHERE ${column} LIKE `;
        key_array.forEach((item, index, arr) => {
            sql += "'%" + item + "%'";
            if (index !== arr.length - 1) {
                sql += ` OR ${column} LIKE `;
            }
        });
        return `${sql} ${condition === "" ? "" : condition}`;
    }


    static #objectToInsert(o) {
        let fields = Object.getOwnPropertyNames(o);
        let fieldString = fields.join(", ");
        let placeholder = new Array(fields.length).fill("?");
        let placeholderString = placeholder.join(", ");
        return {
            fieldString: fieldString,
            placeholderString: placeholderString
        }
    }

    static #objectToUpdate(o) {
        let fields = Object.getOwnPropertyNames(o);
        fields.pop();
        return fields.join(" = ?, ") + " = ?";
    }

}

module.exports = SQL;