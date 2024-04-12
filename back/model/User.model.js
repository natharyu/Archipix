import pool from "../config/database.js";

/**
 * User model class.
 */
class User {
  /**
   * Gets one user by specified field.
   *
   * @param {string} field Field name
   * @param {string} data  Field value
   * @returns {Promise<object>} User object
   */
  static async getOneByField(field, data) {
    const query = `SELECT id, email, storage, firstname, lastname, username, role, reset_token_expires, is_verified, created_at FROM user WHERE ${field} = ? LIMIT 1`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  /**
   * Gets all fields of a user by specified field.
   *
   * @param {string} field Field name
   * @param {string} data  Field value
   * @returns {Promise<object>} User object
   */
  static async getAllFields(field, data) {
    const query = `SELECT id, email, storage, username,password, role, reset_token_expires, is_verified, created_at FROM user WHERE ${field} = ?`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  /**
   * Creates new user.
   *
   * @param {object} data User data
   * @returns {Promise<object>} User object
   */
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

  /**
   * Creates new user by admin.
   *
   * @param {object} data User data
   * @returns {Promise<object>} User object
   */
  static async createByAdmin(data) {
    const query =
      "INSERT INTO user (storage, username, email, password, created_at, firstname, lastname, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      data.storage,
      data.username,
      data.email,
      data.password,
      data.created_at,
      data.firstname,
      data.lastname,
      data.role,
      data.is_verified,
    ]);
    return result;
  }

  /**
   * Updates user data.
   *
   * @param {object} data User data
   * @param {number} id   User id
   * @returns {Promise<object>} Update result
   */
  static async update(data, id) {
    const query = `UPDATE user SET ${Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(query, [...Object.values(data), id]);
    return result;
  }

  /**
   * Gets total number of users.
   *
   * @returns {Promise<object>} Number of users
   */
  static async total() {
    const query = "SELECT COUNT(*) AS totalUsers FROM user";
    const [result] = await pool.execute(query);
    return result;
  }

  /**
   * Gets all users.
   *
   * @returns {Promise<object>} Array of user objects
   */
  static async getAll() {
    const query = "SELECT id, email, storage, username, role, is_verified, created_at FROM user";
    const [result] = await pool.execute(query);
    return result;
  }

  /**
   * Deletes one user.
   *
   * @param {number} id User id
   * @returns {Promise<object>} Delete result
   */
  static async deleteOne(id) {
    const query = "DELETE FROM user WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }
}

export default User;
