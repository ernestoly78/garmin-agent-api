import express, { Request, Response } from "express";
import { callTool, listTools } from "../services/mcp.service";

const router = express.Router();

// 🔥 CACHE SIMPLE EN MEMORIA
const cache: Record<string, any> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

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

// ⚡ ejecutar tool (CON CACHE + LOGS)
router.post("/call", async (req: Request, res: Response) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tool name is required" });
    }

    console.log("🧠 TOOL REQUEST:", name);
    console.log("📥 ARGS:", JSON.stringify(args, null, 2));

    // 🔥 fecha correcta (ayer + ajuste LATAM)
    const date = new Date();
    date.setHours(date.getHours() - 4);
    date.setDate(date.getDate() - 1);

    const enrichedArgs = {
      date: date.toISOString().slice(0, 10),
      startDate: date.toISOString().slice(0, 10),
      endDate: date.toISOString().slice(0, 10),
      ...(args || {})
    };

    console.log("📅 FINAL ARGS:", enrichedArgs);

    // 🔥 CACHE CHECK
    const cacheKey = `${name}-${JSON.stringify(enrichedArgs)}`;

    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      console.log("⚡ CACHE HIT");
      return res.json(cache[cacheKey].data);
    }

    // 🔥 LLAMADA MCP
    const raw = await callTool(name, enrichedArgs);

    console.log("📦 RAW MCP RESPONSE:", JSON.stringify(raw, null, 2));

    let parsedResult: any = raw;

    try {
      const content = raw?.content?.[0]?.text;

      console.log("🧾 RAW CONTENT:", content);

      if (content) {
        // 🚨 detectar rate limit
        if (content.includes("429")) {
          parsedResult = {
            error: "rate_limited",
            message: "Garmin rate limit reached"
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
      parsedResult = { error: "parse_error", raw };
    }

    console.log("✅ FINAL RESULT:", JSON.stringify(parsedResult, null, 2));

    const responseData = {
      tool: name,
      result: parsedResult
    };

    // 🔥 GUARDAR EN CACHE
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: responseData
    };

    res.json(responseData);

  } catch (e: any) {
    console.error("❌ tools/call error FULL:", e);
    res.status(500).json({ error: e.message });
  }
});

// 🧪 DEBUG DESDE NAVEGADOR
router.get("/debug/:tool", async (req: Request, res: Response) => {
  try {
    const tool = req.params.tool;

    const date = new Date();
    date.setHours(date.getHours() - 4);
    date.setDate(date.getDate() - 1);

    const args = {
      date: date.toISOString().slice(0, 10)
    };

    console.log("🧪 DEBUG TOOL:", tool);
    console.log("📅 DEBUG DATE:", args);

    const raw = await callTool(tool, args);

    console.log("📦 DEBUG RAW:", JSON.stringify(raw, null, 2));

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
