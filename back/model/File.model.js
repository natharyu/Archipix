import pool from "../config/database.js";

class File {
  static async getOneByField(field, data) {
    const query = `SELECT id, label, size, type, extension FROM file WHERE ${field} = ? LIMIT 1`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }
  static async getAllByField(field, data) {
    const query = `SELECT id, label, size, type, extension FROM file WHERE ${field} = ? ORDER BY ${field} ASC`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  static async create(data) {
    const query =
      "INSERT INTO file (id, user_id, folder_id, label, size, type, extension, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      data.id,
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

  static async delete(id) {
    const query = `DELETE FROM file WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
  }
}

export default File;
