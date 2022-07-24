const SQL = require("../database/sql");
const Config = require("../config");
const Query = require("../database/database");
const Transaction = require("../database/transaction");

const ObjectHelper = require("../utils/object_helper");
const VerificationHelper = require("../utils/verification_helper");

class CommandDao {

    static containsParam(content) {
        return content.indexOf("?") !== -1;
    }

    static extractParams(wordList) {
        let filteredList = wordList.filter((word) => {
            return VerificationHelper.numberVerification(word.Word);
        });
        let paramList = [];
        filteredList.forEach((item) => {
            paramList.push(item.Word);
        });
        return paramList;
    }

    static setParams(commandData, params) {
        let flag = 0;
        let content = commandData.content.split("");
        for (let i = 0; i < content.length; i++) {
            if (content[i] === "?") {
                content[i] = params[flag++];
            }
        }
        commandData.content = content.join("");
        return commandData;
    }

    static async selectCommand(id) {
        let sql = SQL.generateSQL(SQL.selectById({table_name: "audio_command", id: id}));
        return await Query.query(sql.sql);
    }

    static async selectCommands(page_index) {
        let sql = SQL.generateSQL(SQL.select({
            table_name: "audio_command",
            condition: `LIMIT ${page_index * Config.batch}, ${(page_index + 1) * Config.batch}`
        }));
        let commandData = await Query.query(sql);
        sql = SQL.generateSQL(SQL.count({table_name: "audio_command"}));
        let commandCount = await Query.query(sql.sql);
        return {
            batch: Config.batch,
            total_pages: Math.ceil(commandCount[0]["count"] / Config.batch),
            command_data: commandData,
            command_count: commandCount[0]["count"]
        };
    }

    static async register({keyword, description, content}) {
        let params = {keyword, description, content};
        let sql = SQL.generateSQL(SQL.insert({
            table_name: "audio_command",
            params: params
        }), [keyword, description, content]);
        return await Query.query(sql.sql, sql.params);
    }

    static async update({keyword, description, content, id}) {
        let params = {keyword, description, content, id};
        let sql = SQL.generateSQL(SQL.update({table_name: "audio_command", params: params, condition: `WHERE id = ?`}), [keyword, description, content, id]);
        return await Query.query(sql.sql, sql.params);
    }

    static async switch({is_valid, id}) {
        let params = {is_valid, id};
        let sql = SQL.generateSQL(SQL.update({table_name: "audio_command", params: params, condition: `WHERE id = ?`}), [is_valid, id]);
        return await Query.query(sql.sql, sql.params);
    }

    static async matchCommandsByKeyword(wordList) {
        // a word list
        // [
        //     { Word: '调整', StartTime: 0, EndTime: 510 },
        //     { Word: 'led', StartTime: 510, EndTime: 1230 },
        //     { Word: '亮度', StartTime: 1230, EndTime: 1830 },
        //     { Word: '至', StartTime: 1920, EndTime: 2250 },
        //     { Word: '127', StartTime: 2610, EndTime: 3390 }
        // ]
        let sqls = [];
        let params = [];
        wordList.forEach((word) => {
            sqls.push(SQL.fuzzySearch({
                keyword: word.Word,
                table_name: "audio_command",
                column: "keyword",
                condition: "AND is_valid = 1"
            }));
            params.push([]);
        });
        return await Transaction.transaction(sqls, params);
    }


}

module.exports = CommandDao;