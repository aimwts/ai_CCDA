import express from "express";
import cors from "cors";
import { AppOrchestrator } from "./AppOrchestrator";
import historyRoutes from "./routes/history";
import analyticsRoutes from "./routes/analytics";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/history", historyRoutes);
app.use("/analytics", analyticsRoutes);

const orchestrator = new AppOrchestrator();
orchestrator.init();

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
