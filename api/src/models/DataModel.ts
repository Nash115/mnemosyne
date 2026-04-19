import { pool } from "./db.js";

export class DataModel {
  static async insert(tableName: string, data: Record<string, any>) {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders});`;
    await pool.query(query, values);
  }

  static async getLatest(tableName: string, timestampColumn: string) {
    const query = `
            SELECT *
            FROM ${tableName}
            ORDER BY "${timestampColumn}" DESC LIMIT 1;
        `;
    const { rows } = await pool.query(query);
    return rows[0] || null;
  }

  static async getAll(tableName: string) {
    const { rows, fields } = await pool.query(`SELECT * FROM ${tableName};`);
    return { rows, fields };
  }
}
