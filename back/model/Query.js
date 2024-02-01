import pool from "../config/database.js";

class Query {
  static async run(query) {
    const [result] = await pool.execute(query);
    return result;
  }

  static async runWithParams(query, datas) {
    const [result] = await pool.execute(query, datas);
    return result;
  }

  static async generateUUID() {
    const query = "SELECT UUID() AS uuid";
    const [result] = await pool.execute(query);
    return result;
  }
}

export default Query;
