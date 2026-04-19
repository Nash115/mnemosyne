import { Request, Response } from "express";
import { databaseSchema } from "../config/schema.js";
import { DataModel } from "../models/DataModel.js";

export const dataController = {
  // POST /data/:table_name
  insertData: async (req: Request, res: Response) => {
    const tableName = req.params.table_name as string;
    const schema = databaseSchema[tableName];

    if (!schema) {
      return res.status(404).json({ error: `Unknown table '${tableName}'.` });
    }

    const data = req.body;

    const missingFields = schema.requiredFields.filter(
      (field: string) => data[field] === undefined,
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}.`,
        missing: missingFields,
      });
    }

    try {
      await DataModel.insert(tableName, data);
      res
        .status(201)
        .json({ message: "Data inserted successfully.", table: tableName });
    } catch (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      res.status(500).json({ error: "Server error while inserting data." });
    }
  },

  // GET /live/:table_name
  getLive: async (req: Request, res: Response) => {
    const tableName = req.params.table_name as string;
    const schema = databaseSchema[tableName];

    if (!schema)
      return res.status(404).json({ error: `Unknown table '${tableName}'.` });

    try {
      const latestData = await DataModel.getLatest(
        tableName,
        schema.timestampColumn,
      );
      res.json(latestData || { message: "No data available." });
    } catch (error) {
      console.error(`Live error for ${tableName}:`, error);
      res.status(500).json({ error: "Server error while fetching live data." });
    }
  },

  // GET /export/:table_name
  exportData: async (req: Request, res: Response) => {
    const tableName = req.params.table_name as string;

    if (!databaseSchema[tableName]) {
      return res
        .status(403)
        .send("Unauthorized: Export not allowed for this table.");
    }

    try {
      const { rows, fields } = await DataModel.getAll(tableName);

      if (rows.length === 0)
        return res.status(404).send("No data available for export.");

      const headers = fields.map((field) => field.name).join(";");
      const csvRows = rows.map((row) =>
        fields.map((field) => row[field.name]).join(";"),
      );
      const csvContent = [headers, ...csvRows].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${tableName}.csv`,
      );
      res.status(200).send(csvContent);
    } catch (error) {
      console.error(`Error exporting ${tableName}:`, error);
      res.status(500).send("Error exporting data.");
    }
  },
};
