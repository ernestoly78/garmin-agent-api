import express from "express";
import coachRoutes from "./routes/coach.routes";
import memoryRoutes from "./routes/memory.routes";
import healthRoutes from "./routes/health.routes";

const app = express();
app.use(express.json());

app.use("/coach", coachRoutes);
app.use("/memory", memoryRoutes);
app.use("/health", healthRoutes);

app.get("/", (_, res) => {
  res.json({ status: "garmin-agent-api online 🧠" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Coach API running");
});
