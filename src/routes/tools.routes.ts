import express, { Request, Response } from "express";
import { callTool, listTools } from "../services/mcp.service";

const router = express.Router();

// 🧠 CONTROL SUAVE DE LLAMADAS
let lastCallTime = 0;
const MIN_INTERVAL = 2000; // 2 segundos

// 🔍 listar tools (todas disponibles)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tools = await listTools();
    res.json({ tools });
  } catch (e: any) {
    console.error("❌ tools/list error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ⚡ ejecutar tool (SIN RESTRICCIONES)
router.post("/call", async (req: Request, res: Response) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tool name is required" });
    }

    console.log("🧠 TOOL REQUEST:", name);

    // 🔥 RATE LIMIT SUAVE
    const now = Date.now();
    if (now - lastCallTime < MIN_INTERVAL) {
      return res.json({
        tool: name,
        result: {
          error: "rate_limited",
          message: "Please wait a moment before calling another tool"
        }
      });
    }

    lastCallTime = now;

    // 📅 usar ayer (clave Garmin)
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const enrichedArgs = {
      date: date.toISOString().slice(0, 10),
      ...(args || {})
    };

    console.log("📅 ARGS:", enrichedArgs);

    const raw = await callTool(name, enrichedArgs);

    console.log("📦 RAW MCP:", JSON.stringify(raw, null, 2));

    let parsedResult: any = raw;

    try {
      const content = raw?.content?.[0]?.text;

      if (content) {
        console.log("🧾 CONTENT:", content);

        // 🚨 detectar 429 Garmin
        if (content.includes("429")) {
          parsedResult = {
            error: "garmin_rate_limit",
            message: "Garmin is temporarily limiting requests"
          };
        } else {
          try {
            parsedResult = JSON.parse(content);
          } catch {
            parsedResult = { message: content };
          }
        }
      }
    } catch (e) {
      console.error("⚠️ PARSE ERROR:", e);
      parsedResult = { error: "parse_error" };
    }

    console.log("✅ FINAL RESULT:", parsedResult);

    res.json({
      tool: name,
      result: parsedResult
    });

  } catch (e: any) {
    console.error("❌ tools/call error:", e);
    res.status(500).json({ error: e.message });
  }
});

// 🧪 debug libre (sin rate limit)
router.get("/debug/:tool", async (req: Request, res: Response) => {
  try {
    const tool = req.params.tool;

    const date = new Date();
    date.setDate(date.getDate() - 1);

    const args = {
      date: date.toISOString().slice(0, 10)
    };

    console.log("🧪 DEBUG TOOL:", tool);

    const raw = await callTool(tool, args);

    res.json({
      tool,
      raw
    });

  } catch (e: any) {
    console.error("❌ DEBUG ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
