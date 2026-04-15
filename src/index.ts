import express from "express";
import coachRoutes from "./routes/coach.routes";

const app = express();
app.use(express.json());

app.use("/coach", coachRoutes);

app.get("/", (_, res) => {
  res.json({ status: "garmin-agent-api online 🧠" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("API running");
});
