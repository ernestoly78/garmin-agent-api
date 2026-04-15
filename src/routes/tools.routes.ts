import express, { Request, Response } from "express";
import { callTool, listTools } from "../services/mcp.service";

const router = express.Router();

// 🔍 listar tools
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tools = await listTools();
    res.json({ tools });
  } catch (e: any) {
    console.error("❌ tools/list error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ⚡ ejecutar tool
router.post("/call", async (req: Request, res: Response) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tool name is required" });
    }

    // 🔥 auto fecha
    const today = new Date().toISOString().slice(0, 10);

    const enrichedArgs = {
      date: today,
      startDate: today,
      endDate: today,
      ...(args || {})
    };

    const raw = await callTool(name, enrichedArgs);

    // 🔥 parsear respuesta MCP
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
