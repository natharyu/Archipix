import mysql from "mysql2/promise";

/**
 * createPool creates a pool of database connections to be used throughout the application.
 * The pool has a connectionLimit of 10, meaning that up to 10 connections can be open at any given time.
 * The queueLimit is set to 0, which means that if all 10 connections are in use, any new request for a connection
 * will be rejected instead of being queued.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST, // host is the hostname of the MySQL server
  user: process.env.DB_USER, // user is the username used to connect to the MySQL server
  password: process.env.DB_PASS, // password is the password used to connect to the MySQL server
  database: process.env.DB_NAME, // database is the name of the database to use for all connections
  waitForConnections: true, // waitForConnections determines whether or not the pool will wait (block) for a connection to become available if all connections are in use
  connectionLimit: 10, // connectionLimit is the maximum number of connections the pool is allowed to have at any given time
  queueLimit: 0, // queueLimit is the maximum number of connection requests the pool is allowed to have waiting in the queue; if set to 0, requests will be rejected instead of waiting
});

/**
 * logConnection logs a message to the console indicating that a connection has been created from the pool.
 */
pool.getConnection().then((connection) => {
  console.log("Connected to database " + connection.config.database); // connection.config.database is the name of the database the connection is connected to
  connection.release(); // release() closes the connection and returns it to the pool for reuse
});

export default pool; // the exported pool is the pool of database connections to be used throughout the application.
