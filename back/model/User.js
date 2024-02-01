import pool from "../config/database.js";

class User {
  static async getOneByField(field, data) {
    const query = `SELECT id, email, password, storage, username, role, reset_token_expires FROM user WHERE ${field} = ?`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  static async create(data) {
    const query =
      "INSERT INTO user (storage, username, email, password, created_at, email_verification_token) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      data.storage,
      data.username,
      data.email,
      data.password,
      data.created_at,
      data.email_verification_token,
    ]);
    return result;
  }

  static async update(data, id) {
    const query = `UPDATE user SET ${Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(query, [...Object.values(data), id]);
    return result;
  }
}

export default User;
