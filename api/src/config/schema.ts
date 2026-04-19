export interface TableSchema {
  timestampColumn: string;
  columns: Record<string, string>;
  requiredFields: string[];
}

export const databaseSchema: Record<string, TableSchema> = {
  meteo: {
    timestampColumn: "timestamp",
    columns: {
      timestamp: "TIMESTAMP NOT NULL",
      temperature: "REAL NOT NULL",
      humidity: "REAL NOT NULL",
    },
    requiredFields: ["timestamp", "temperature", "humidity"],
  },
};
