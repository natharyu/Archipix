import pool from "../config/database.js";

class Folder {
  static async create(data) {
    const query = "INSERT INTO folder (id, user_id, label, created_at) VALUES (?, ?, ?, ?)";
    const [result] = await pool.execute(query, [data.id, data.user_id, data.label, data.created_at]);
    return result;
  }
}

export default Folder;
