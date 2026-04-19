import { Router } from "express";
import { dataController } from "../controllers/dataController.js";
import { requireApiKey } from "../middlewares/auth.js";

const router = Router();

router.get("/live/:table_name", requireApiKey, dataController.getLive);
router.post("/data/:table_name", requireApiKey, dataController.insertData);
router.get("/export/:table_name", requireApiKey, dataController.exportData);

export default router;
