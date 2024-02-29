import pool from "../config/database.js";

class Query {
  static async generateUUID() {
    const query = "SELECT UUID() AS uuid";
    const [result] = await pool.execute(query);
    return result;
  }
}

export default Query;
