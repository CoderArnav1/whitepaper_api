import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload";
const app = express();
const PORT = 2000;

app.use(cors());
app.use(express.json());
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
