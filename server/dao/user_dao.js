const SQL = require("../database/sql");
const Config = require("../config");
const Query = require("../database/database");

class UserDao {

    static async selectUser(id) {
        let sql = SQL.generateSQL(SQL.selectById({table_name: "user", id: id}));
        return await Query.query(sql.sql);
    }

    static async login({username, password}) {
        let sql = SQL.generateSQL(SQL.select({
            table_name: "user",
            condition: `WHERE password = '${password}' AND username = '${username}' OR tel = '${username}' OR email = '${username}'`
        }));
        return await Query.query(sql.sql, sql.params);
    }

    static async register({nickname, username, password, tel}) {
        let params = {nickname, username, password, tel};
        let sql = SQL.generateSQL(SQL.insert({
            table_name: "user",
            params: params
        }), [nickname, username, password, tel]);
        return await Query.query(sql.sql, sql.params);
    }

    static async fullRegister({username, password, realname, nickname, tel, email}) {
        let params = {username, password, realname, nickname, tel, email};
        let sql = SQL.generateSQL(SQL.insert({
            table_name: "user",
            params: params
        }), [username, password, realname, nickname, tel, email]);
        return await Query.query(sql.sql, sql.params);
    }

    static async selectUsers(page_index) {
        let sql = SQL.generateSQL(SQL.select({
            table_name: "user",
            condition: `LIMIT ${page_index * Config.batch}, ${(page_index + 1) * Config.batch}`
        }));
        let userData = await Query.query(sql.sql);
        sql = SQL.generateSQL(SQL.count({table_name: "user"}));
        let userCount = await Query.query(sql.sql);
        return {
            batch: Config.batch,
            total_pages: Math.ceil(userCount[0]["count"] / Config.batch),
            user_data: userData,
            user_count: userCount[0]["count"]
        };
    }

    static async update({realname, nickname, avatar, tel, email, id}) {
        let params = {realname, nickname, avatar, tel, email, id};
        let sql = SQL.generateSQL(SQL.update({table_name: "user", params: params, condition: `WHERE id = ?`}), [realname, nickname, avatar, tel, email, id]);
        return await Query.query(sql.sql, sql.params);
    }

}

module.exports = UserDao;

