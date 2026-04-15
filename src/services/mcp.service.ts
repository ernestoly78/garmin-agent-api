const MCP_URL = process.env.MCP_URL!;

// 🔥 llamada genérica al MCP
async function callMCP(payload: any) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

// 🧠 listar todas las tools
export async function listTools() {
  const data = await callMCP({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list"
  });

  return data.result?.tools || [];
}

// ⚡ ejecutar cualquier tool
export async function callTool(name: string, args: any = {}) {
  const data = await callMCP({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name,
      arguments: args
    }
  });

  return data.result;
}
