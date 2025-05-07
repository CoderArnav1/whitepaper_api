import express from "express";
import {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
} from "../controllers/client.controller";

const router = express.Router();

router.post("/", createClient);
router.get("/", getAllClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
