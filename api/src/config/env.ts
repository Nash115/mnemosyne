import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT_API || 5042,
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432", 10),
  },
  apiKeys: (process.env.API_KEYS || "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean),
};
