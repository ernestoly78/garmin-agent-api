router.post("/call", async (req, res) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tool name is required" });
    }

    // 🔥 FIX CLAVE: definir enrichedArgs
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
