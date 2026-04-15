import { getGarminData } from "./garmin.service";

export async function getDailyCoach() {
  const data = await getGarminData();

  if (!data) {
    return {
      summary: "Sin datos disponibles, usa sensaciones.",
      state: {
        readiness: "unknown",
        fatigue: "unknown"
      },
      recommendation: "light_training"
    };
  }

  const readinessScore =
    data.readiness?.result?.score ||
    data.readiness?.score ||
    50;

  const sleepScore =
    data.sleep?.result?.sleepScore ||
    data.sleep?.sleepScore ||
    60;

  const hrv =
    data.hrv?.result?.value ||
    data.hrv?.value ||
    40;

  // 🧠 lógica simple pero potente
  let state = "medium";
  let recommendation = "moderate_training";

  if (readinessScore > 70 && sleepScore > 70) {
    state = "high";
    recommendation = "hard_training";
  } else if (readinessScore < 40 || sleepScore < 50) {
    state = "low";
    recommendation = "recovery";
  }

  return {
    summary: `Readiness ${readinessScore}, sueño ${sleepScore}.`,
    state: {
      readiness: state,
      fatigue: state === "low" ? "high" : "low"
    },
    body_signals: {
      readinessScore,
      sleepScore,
      hrv
    },
    recommendation
  };
}
