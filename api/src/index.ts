import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config/env.js";
import dataRoutes from "./routes/dataRoutes.js";
import { initializeDatabase } from "./models/initDb.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) =>
  res.send("mnemosyne API available."),
);
app.get("/health", (req: Request, res: Response) => res.send("OK"));

app.use("/", dataRoutes);

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(config.port, () => {
      console.log(`Server listening on :${config.port}`);
      console.log(`${config.apiKeys.length} api key(s) configured.`);
    });
  } catch (error) {
    console.error("FATAL ERROR: Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
