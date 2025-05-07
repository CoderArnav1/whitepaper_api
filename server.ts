import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload";
import clientRoutes from "./routes/client.routes";
const app = express();
const PORT = 2000;

app.use(cors());
app.use(express.json());
app.use("/upload", uploadRoutes);
app.use("/clients", clientRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
