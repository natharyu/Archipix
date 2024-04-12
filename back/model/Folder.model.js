import pool from "../config/database.js";

/**
 * Folder model class.
 */
class Folder {
  /**
   * Creates a folder.
   * @param {object} data - Data used to create the folder.
   * @param {string} data.id - Folder id.
   * @param {string} data.user_id - User id that created the folder.
   * @param {string} data.parent_id - Parent folder id.
   * @param {string} data.label - Folder label.
   * @param {string} data.created_at - Folder creation date.
   * @returns {object} The MySQL result of the INSERT query.
   */
  static async create(data) {
    const query = "INSERT INTO folder (id, user_id, parent_id, label, created_at) VALUES (?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [data.id, data.user_id, data.parent_id, data.label, data.created_at]);
    return result;
  }

  /**
   * Gets a folder by its id.
   * @param {string} id - Folder id.
   * @returns {object} The MySQL result of the SELECT query.
   */
  static async getOneById(id) {
    const query = "SELECT id, user_id, parent_id, label FROM folder WHERE id = ? LIMIT 1";
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  /**
   * Gets one or more folders by a specific field.
   * @param {string} field - Field used to search for folders.
   * @param {string} data - Data used to search for folders.
   * @returns {object} The MySQL result of the SELECT query.
   */
  static async getByField(field, data) {
    const query = `SELECT id, user_id, parent_id, label FROM folder WHERE ${field} = ?`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }

  /**
   * Deletes a folder.
   * @param {string} id - Folder id.
   * @returns {object} The MySQL result of the DELETE query.
   */
  static async deleteOne(id) {
    const query = "DELETE FROM folder WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }
}

export default Folder;
