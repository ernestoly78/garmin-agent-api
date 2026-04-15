import express from "express";
import { getDailyCoach } from "../services/coach.engine";

const router = express.Router();

router.get("/daily", async (_, res) => {
  const data = await getDailyCoach();
  res.json(data);
});

export default router;
