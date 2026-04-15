export function computeReadiness(data: any) {
  let score = 100;

  if (data.hrv < 40) score -= 30;
  if (data.sleep_score < 70) score -= 25;
  if (data.resting_hr > 70) score -= 15;
  if (data.training_load > 800) score -= 20;

  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}
