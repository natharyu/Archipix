import pool from "../config/database.js";

class Share {
  static async create(data) {
    const query =
      "INSERT INTO share (file_id, folder_id, link, user_id, created_at, expiration) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      data.file_id,
      data.folder_id,
      data.link,
      data.user_id,
      data.created_at,
      data.expiration,
    ]);
    return result;
  }

  static async getOneById(id) {
    const query = "SELECT * FROM share WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  static async deleteOne(id) {
    const query = "DELETE FROM share WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }
}

export default Share;
