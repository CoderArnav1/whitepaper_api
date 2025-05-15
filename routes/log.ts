import express from "express";
import { getLogs } from "../controllers/log.controller";

const logrouter = express.Router();

logrouter.get("/", getLogs);

export default logrouter;
