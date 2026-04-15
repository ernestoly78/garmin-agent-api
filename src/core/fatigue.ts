export function computeFatigue(data: any) {
  const load = data.training_load || 0;

  if (load > 900) return "high";
  if (load > 600) return "medium";
  return "low";
}
