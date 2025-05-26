import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import uploadRoutes from "./routes/upload";
import clientRoutes from "./routes/client.routes";
import fileConfigRoutes from "./routes/fileConfig.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./apiSpec"; // adjust if renamed
import logrouter from "./routes/log";
import { logAction } from "./utils/logAction";
const app = express();
const PORT = 2000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logAction({
    message: `HTTP ${req.method} ${req.url}`,
    action: "http_request",
    status: "start",
    user_id: 1111, // if you implement auth middleware that sets req.user
  });
  next();
});

app.use("/upload", uploadRoutes);
app.use("/clients", clientRoutes);
app.use("/logs", logrouter);
app.use("/file-config", fileConfigRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logAction({
    message: `Error: ${err.message}`,
    action: "error",
    status: "fail",
    user_id: 1111,
  });
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
