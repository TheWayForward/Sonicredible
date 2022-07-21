const SQL = require("../database/sql");
const Config = require("../config");
const Query = require("../database/database");

class CommandDao {

    static async selectCommand(id) {
        let sql = {
            sql: `SELECT ac.id, ac.platform_id, ac.keyword, ac.content, ac.description, ac.is_valid, ac.time_created, ac.time_modified, p.platform_family_id, p.name as platform_name, pf.name as platform_famliy_name FROM audio_command ac JOIN platform p JOIN platform_family pf ON ac.platform_id = p.id AND p.platform_family_id = pf.id WHERE ac.id = ?`,
            params: [id]
        };
        return await Query.query(sql.sql, sql.params);
    }

    static async selectCommands(page_index) {
        let sql = `SELECT ac.id, ac.platform_id, ac.keyword, ac.content, ac.description, ac.is_valid, ac.time_created, ac.time_modified, p.platform_family_id, p.name as platform_name, pf.name as platform_famliy_name FROM audio_command ac JOIN platform p JOIN platform_family pf ON ac.platform_id = p.id AND p.platform_family_id = pf.id LIMIT ${page_index * Config.batch}, ${(page_index + 1) * Config.batch}`;
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
}

module.exports = CommandDao;