const SQL = require("../database/sql");
const Config = require("../config");
const Query = require("../database/database");

class VoiceprintDao {

    static async selectVoiceprint(id) {
        let sql = SQL.generateSQL(SQL.selectById({table_name: "voiceprint", id: id}));
        return await Query.query(sql.sql);
    }

    static async selectVoiceprintByUserId(user_id) {
        let sql = SQL.generateSQL(SQL.select({
            table_name: "voiceprint",
            condition: `WHERE user_id = ${user_id} ORDER BY time_modified DESC`
        }));
        return await Query.query(sql.sql);
    }

    static async selectVoiceprints(page_index) {
        let sql = SQL.generateSQL(SQL.select({
            table_name: "voiceprint",
            condition: `LIMIT ${page_index * Config.batch}, ${Config.batch}`
        }));
        let voiceprintData = await Query.query(sql.sql);
        sql = SQL.generateSQL(SQL.count({table_name: "voiceprint"}));
        let voiceprintCount = await Query.query(sql.sql);
        return {
            batch: Config.batch,
            total_pages: Math.ceil(voiceprintCount[0]["count"] / Config.batch),
            voiceprint_data: voiceprintData,
            voiceprint_count: voiceprintCount[0]["count"]
        };
    }

    static async insertVoiceprint({user_id, url}) {
        let params = {user_id, url};
        let sql = SQL.generateSQL(SQL.insert({table_name: "voiceprint", params: params}), [user_id, url]);
        return await Query.query(sql.sql, sql.params);
    }

}

module.exports = VoiceprintDao;