import pool from "../config/database.js";

/**
 * File model class.
 */
class File {
  /**
   * Gets one file by given field and data.
   *
   * @param {string} field - Field to search.
   * @param {any} data - Data to search.
   *
   * @returns {Promise<array>} Promise with query result.
   */
  static async getOneByField(field, data) {
    const query = `SELECT id, user_id, label, size, type, extension FROM file WHERE ${field} = ? LIMIT 1`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  static getOneByFieldByUser(field, data, user_id) {
    const query = `SELECT id, user_id, label, size, type, extension FROM file WHERE ${field} = ? AND user_id = ? LIMIT 1`;
    const result = pool.execute(query, [data, user_id]);
    return result;
  }

  /**
   * Gets all files by given field and data.
   *
   * @param {string} field - Field to search.
   * @param {any} data - Data to search.
   *
   * @returns {Promise<array>} Promise with query result.
   */
  static async getAllByField(field, data) {
    const query = `SELECT id, user_id, label, size, type, extension FROM file WHERE ${field} = ? ORDER BY label ASC`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  /**
   * Creates a new file.
   *
   * @param {object} data - File data.
   *
   * @returns {Promise<array>} Promise with query result.
   */
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

  /**
   * Counts total files by user.
   *
   * @param {number} id - User id.
   *
   * @returns {Promise<array>} Promise with query result.
   */
  static async countTotal(id) {
    const query = "SELECT COUNT(*) AS totalFiles FROM file WHERE user_id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  /**
   * Gets total size by user.
   *
   * @param {number} id - User id.
   *
   * @returns {Promise<array>} Promise with query result.
   */
  static async getTotalSize(id) {
    const query = "SELECT SUM(size) AS totalSize FROM file WHERE user_id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  /**
   * Updates file by id.
   *
   * @param {object} data - File data.
   * @param {number} id - File id.
   *
   * @returns {Promise<array>} Promise with query result.
   */
  static async update(data, id) {
    const query = `UPDATE file SET ${Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")} WHERE id = ?`;
    const [result] = await pool.execute(query, [...Object.values(data), id]);
    return result;
  }

  /**
   * Deletes a file by id.
   *
   * @param {number} id - File id.
   *
   * @returns {Promise<array>} Promise with query result.
   */
  static async deleteOne(id) {
    const query = `DELETE FROM file WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  /**
   * Counts total files.
   *
   * @returns {Promise<array>} Promise with query result.
   */
  static async total() {
    const query = "SELECT COUNT(*) AS totalFiles FROM file";
    const [result] = await pool.execute(query);
    return result;
  }
}

export default File;
