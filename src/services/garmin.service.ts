import { callTool } from "./mcp.service";

let cache: any = null;
let lastFetch = 0;

const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function getGarminData() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TTL) {
    console.log("⚡ USING GARMIN CACHE");
    return cache;
  }

  console.log("🔥 FETCHING GARMIN DATA");

  const date = getYesterday();

  try {
    // 🔥 intentamos varias fuentes
    const readiness = await callTool("get_training_readiness", { date });
    const sleep = await callTool("get_sleep_data", { date });
    const hrv = await callTool("get_hrv", { date });

    const data = {
      readiness,
      sleep,
      hrv,
      date
    };

    cache = data;
    lastFetch = now;

    return data;

  } catch (e) {
    console.error("❌ GARMIN FETCH FAILED:", e);

    // 🔥 fallback a cache anterior
    if (cache) {
      console.log("🧠 USING FALLBACK CACHE");
      return cache;
    }

    return null;
  }
}
