import express from "express";
import { listTools, callTool } from "../services/mcp.service";

const router = express.Router();

// 🔍 ver todas las tools
router.get("/", async (_req, res) => {
  try {
    const tools = await listTools();
    res.json({ tools });
  } catch (e: any) {
    console.error("❌ tools/list error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ⚡ ejecutar tool dinámica
router.post("/call", async (req, res) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tool name is required" });
    }

    const result = await callTool(name, args || {});

    res.json({
      tool: name,
      result
    });

  } catch (e: any) {
    console.error("❌ tools/call error:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
