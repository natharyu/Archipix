import pool from "../config/database.js";

class Share {
  /**
   * Creates a new share.
   *
   * @param {object} data - Share data.
   * @param {string} data.id - Share id.
   * @param {string} data.file_id - File id.
   * @param {string} data.folder_id - Folder id.
   * @param {string} data.link - Share link.
   * @param {string} data.user_id - User id that shared the file.
   * @param {string} data.created_at - Share creation date.
   * @param {string} data.expiration - Share expiration date.
   *
   * @returns {object} The MySQL result of the INSERT query.
   */
  static async create(data) {
    const query =
      "INSERT INTO share (id, file_id, folder_id, link, user_id, created_at, expiration) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      data.id,
      data.file_id,
      data.folder_id,
      data.link,
      data.user_id,
      data.created_at,
      data.expiration,
    ]);
    return result;
  }

  /**
   * Updates a share.
   *
   * @param {object} data - Share data.
   * @param {string} id - Share id.
   *
   * @returns {object} The MySQL result of the UPDATE query.
   */
  static async update(data, id) {
    // Build the query using the object keys and values,
    // and the id as a WHERE condition.
    const query = `UPDATE share SET ${Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")} WHERE id = ?`;

    // Execute the query and return the result.
    const [result] = await pool.execute(query, [...Object.values(data), id]);
    return result;
  }

  static async getOneById(id) {
    const query = "SELECT * FROM share WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    // Deletes a share.
    //
    // @param {string} id - Share id.
    //
    // @returns {object} The MySQL result of the DELETE query.
    return result;
  }

  /**
   * Deletes a share.
   *
   * @param {string} id - Share id.
   *
   * @returns {object} The MySQL result of the DELETE query.
   */
  static async deleteOne(id) {
    const query = "DELETE FROM share WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result;
  }

  /**
   * Gets all shares that match a given field and its value.
   *
   * @param {string} field - The field name to match.
   * @param {string} data - The field value to match.
   *
   * @returns {object} The MySQL result of the SELECT query.
   */
  static async getAllByField(field, data) {
    const query = `SELECT id, url, expiration, created_at FROM share WHERE ${field} = ?`;
    const [result] = await pool.execute(query, [data]);
    return result;
  }
}

export default Share;
