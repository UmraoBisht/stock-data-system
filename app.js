// app.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import connectToDB from "./config/db.js";
import stockRoutes from "./routes/stockRoutes.js";
const app = express();
app.use(express.json());
connectToDB();

app.use("/api", stockRoutes);

app.all("*", (_, res) => {
  res.status(404).json({ message: "Page not found" }); // 404 handler
});

// global eror handeling
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
