import pool from "../config/database.js";

class Folder {
  static async create(data) {
    const query = "INSERT INTO folder (id, user_id, parent_id, label, created_at) VALUES (?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [data.id, data.user_id, data.parent_id, data.label, data.created_at]);
    return result;
  }

  static async getOneById(id) {
    const query = "SELECT id, user_id, parent_id, label FROM folder WHERE id = ? LIMIT 1";
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  static async getByField(field, data) {
    const query = `SELECT id, user_id, parent_id, label FROM folder WHERE ${field} = ?`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  static async deleteOne(id) {
    const query = "DELETE FROM folder WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }
}

export default Folder;
