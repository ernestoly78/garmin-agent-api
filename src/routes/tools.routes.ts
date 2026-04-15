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
    // 🔥 auto-inyectar fecha
    const today = new Date().toISOString().slice(0, 10);
    
    if (!name) {
      return res.status(400).json({ error: "Tool name is required" });
    }

const raw = await callTool(name, enrichedArgs);

// 🔥 EXTRAER contenido real del MCP
let parsedResult = raw;

try {
  const content = raw?.content?.[0]?.text;

  if (content) {
    parsedResult = JSON.parse(content);
  }
} catch (e) {
  console.error("⚠️ parse error, using raw result");
}

res.json({
  tool: name,
  result: parsedResult
});

  } catch (e: any) {
    console.error("❌ tools/call error:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
