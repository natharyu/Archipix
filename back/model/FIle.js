import pool from "../config/database.js";

class File {
  static async getOneByField(field, data) {
    const query = `SELECT id, label, size, type, extension FROM file WHERE ${field} = ?`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  static async create(data) {
    const query =
      "INSERT INTO file (user_id,folder_id, label, size, type, extension, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      data.user_id,
      data.folder_id,
      data.label,
      data.size,
      data.type,
      data.extension,
      data.created_at,
    ]);
    return result;
  }

  static async update(data, id) {
    const query = `UPDATE file SET ${Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(query, [...Object.values(data), id]);
    return result;
  }
}

export default File;
