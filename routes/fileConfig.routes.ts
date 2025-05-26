import express from "express";
import { getFormatsByClientName, getRulesByClientIdAndFormat } from "../controllers/fileConfig.controller";

const router = express.Router();

router.get("/formats/:clientName", getFormatsByClientName);
router.get("/rules/:clientId/:format", getRulesByClientIdAndFormat);
export default router;