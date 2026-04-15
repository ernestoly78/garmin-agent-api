const MCP_URL = process.env.MCP_URL!;

export async function getGarminData() {
  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list"
    })
  });

  const data = await response.json();

  console.log("MCP RESPONSE:", data);

  return {
    heart_rate_avg: 65,
    hrv: 40,
    sleep_score: 75,
    training_load: 500,
    recovery_score: 60,
    resting_hr: 60
  };
}
