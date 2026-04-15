import { getGarminData } from "./garmin.service";
import { computeReadiness } from "../core/readiness";
import { computeFatigue } from "../core/fatigue";
import { saveMemory, getMemory } from "./memory.engine";

export async function getDailyCoach() {
  const data = await getGarminData();

  const readiness = computeReadiness(data);
  const fatigue = computeFatigue(data);

  const entry = {
    hrv: data.hrv,
    sleep: data.sleep_score,
    load: data.training_load,
  };

  saveMemory(entry);
  const memory = getMemory();

  return {
    date: new Date().toISOString(),

    state: {
      readiness,
      fatigue,
      recovery: data.recovery_score,
    },

    body_signals: {
      hr: data.heart_rate_avg,
      hrv: data.hrv,
      sleep: data.sleep_score,
      load: data.training_load,
    },

    interpretation: {
      summary: buildNarrative(readiness, fatigue),
      recommendation: getRecommendation(readiness, fatigue),
    },

    memory
  };
}

function buildNarrative(readiness: string, fatigue: string) {
  if (readiness === "low") {
    return "Sistema nervioso exigido. Prioriza recuperación.";
  }

  if (fatigue === "high") {
    return "Fatiga acumulada. Mantén baja intensidad.";
  }

  return "Buen estado general. Puedes entrenar con control.";
}

function getRecommendation(readiness: string, fatigue: string) {
  if (readiness === "low") return "recovery_day";
  if (fatigue === "high") return "zone_2_only";
  return "normal_training";
}
