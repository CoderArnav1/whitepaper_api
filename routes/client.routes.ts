import express from "express";
/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management routes
 */
import {
  createClient,
  getAllClientsIncludingDeleted,
  getAllClients,
  updateClient,
  deleteClient,
  getClientDocuments,
} from "../controllers/client.controller";

const router = express.Router();
/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 */
router.post("/", createClient);
/**
 * @swagger
 * /clients/included-deleted:
 *   get:
 *     summary: Get all clients including deleted ones
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of all clients, including deleted ones
 */
router.get("/included-deleted", getAllClientsIncludingDeleted);
/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all active clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of all clients
 */
router.get("/", getAllClients);
/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 */
router.put("/:id", updateClient);
/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client deleted successfully
 */
router.delete("/:id", deleteClient);
/**
 * @swagger
 * /clients/{id}/documents:
 *   get:
 *     summary: Get all documents for a specific client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the client
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents for the client
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to fetch documents
 */
router.get("/:id/documents", getClientDocuments);

export default router;
