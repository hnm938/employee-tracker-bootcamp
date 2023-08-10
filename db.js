// db.js
const mysql = require("mysql2");

// Create a pool to manage connections (recommended for production)
const pool = mysql.createPool({
  host: "localhost", // e.g., 'localhost'
  user: "root",
  password: "mmps23",
  database: "employee_tracker",
  connectionLimit: 10, // Adjust according to your needs
});

// Export the pool to be used in other parts of the application
module.exports = pool.promise();
