const SQL = require("../database/sql");
const Config = require("../config");
const Query = require("../database/database");

class AudioDao {

    static async selectAudio(id) {
        let sql = SQL.generateSQL(SQL.selectById({table_name: "audio_recognition", id: id}));
        return await Query.query(sql.sql);
    }

    static async selectAudioByUserId(user_id) {
        let sql = SQL.generateSQL(SQL.select({table_name: "audio_recognition", condition: `WHERE user_id = ${user_id}`}));
        return await Query.query(sql.sql);
    }

    static async selectAudioBySerial(serial) {
        let sql = SQL.generateSQL(SQL.select({table_name: "audio_recognition", condition: `WHERE serial = ${serial}`}));
        return await Query.query(sql.sql);
    }

    static async selectAudios(page_index) {
        let sql = SQL.generateSQL(SQL.select({
            table_name: "audio_recognition",
            condition: `LIMIT ${page_index * Config.batch}, ${(page_index + 1) * Config.batch}`
        }));
        let audioData = await Query.query(sql.sql);
        sql = SQL.generateSQL(SQL.count({table_name: "audio_recognition"}));
        let audioCount = await Query.query(sql.sql);
        return {
            batch: Config.batch,
            total_pages: Math.ceil(audioCount[0]["count"] / Config.batch),
            audio_data: audioData,
            audio_count: audioCount[0]["count"]
        };
    }

    static async insertAudio({serial, user_id, url, base64 = ""}) {
        let params = {serial, user_id, url, base64};
        let sql = SQL.generateSQL(SQL.insert({table_name: "audio_recognition", params: params}), [serial, user_id, url, base64]);
        return await Query.query(sql.sql, sql.params);
    }

    static async updateResult({result, id}) {
        let params = {result, id};
        let sql = SQL.generateSQL(SQL.update({table_name: "audio_recognition", params: params, condition: `WHERE id = ?`}), [result, id]);
        return await Query.query(sql.sql, sql.params);
    }

}

module.exports = AudioDao;