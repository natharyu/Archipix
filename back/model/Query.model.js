import pool from "../config/database.js";

/**
 * Query class provides methods to execute queries on the database.
 */
class Query {
  /**
   * generateUUID generates a UUID to be used as primary keys in the database.
   * @returns {Promise<{uuid: string}>} A promise that resolves to an object containing the generated UUID.
   */
  static async generateUUID() {
    const query = "SELECT UUID() AS uuid"; // The query to generate the UUID
    const [result] = await pool.execute(query); // Execute the query and return the result
    return result; // The UUID is stored in the "uuid" property of the result
  }
}
export default Query;
