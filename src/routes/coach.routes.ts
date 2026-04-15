import express from "express";
import { getDailyCoach } from "../services/coach.engine";

const router = express.Router();

router.get("/daily", async (_req, res) => {
  try {
    const coach = await getDailyCoach();
    res.json(coach);
  } catch (e: any) {
    console.error("❌ coach error:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
