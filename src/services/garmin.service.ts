const MCP_URL = process.env.MCP_URL || "https://TU-MCP.onrender.com/mcp";

export async function getGarminData() {
  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      action: "get_daily_summary"
    }),
  });

  const result = await response.json();

  // 🔄 Mapeo MCP → Coach API
  return {
    heart_rate_avg: result.heart_rate_avg,
    hrv: result.hrv,
    sleep_score: result.sleep_score,
    training_load: result.training_load,
    recovery_score: result.recovery_score,
    resting_hr: result.resting_hr
  };
}
