import { pool } from "./db.js";
import { databaseSchema } from "../config/schema.js";

export const initializeDatabase = async () => {
  for (const [tableName, schema] of Object.entries(databaseSchema)) {
    const columnDefinitions = Object.entries(schema.columns)
      .map(([colName, colType]) => `"${colName}" ${colType}`)
      .join(", ");

    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;

    try {
      await pool.query(query);
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
    }
  }

  console.log("Database initialization complete.");
};
