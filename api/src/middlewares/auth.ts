import { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";

export const requireApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.header("x-api-key");

  if (config.apiKeys.length === 0) {
    console.error("CRITICAL ERROR: No API keys defined in .env (API_KEYS)");
    return res.status(500).json({ error: "Server conf critical error" });
  }

  if (!apiKey || !config.apiKeys.includes(apiKey)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
