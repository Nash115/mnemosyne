import { Pool } from "pg";
import { config } from "../config/env.js";

export const pool = new Pool(config.db);
