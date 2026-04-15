let memoryStore: any[] = [];

export function saveMemory(entry: any) {
  memoryStore.push({
    ...entry,
    timestamp: new Date().toISOString()
  });

  memoryStore = memoryStore.slice(-30);
}

export function getMemory() {
  return {
    trend: analyzeTrend(),
    last_entries: memoryStore.slice(-7)
  };
}

function analyzeTrend() {
  const values = memoryStore.map(m => m.hrv || 0);

  if (values.length < 2) return "stable";

  const diff = values[values.length - 1] - values[0];

  if (diff < -5) return "declining";
  if (diff > 5) return "improving";
  return "stable";
}
