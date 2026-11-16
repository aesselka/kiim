/**
 * In-memory daily limits. Good enough for a demo on a single region:
 * a cold start resets the counters, which only ever errs on the generous side.
 */

const PER_IP_RUNS = 3;
const IMAGES_PER_RUN = 3;

type Day = { date: string; total: number; byIp: Map<string, number> };

const state: Day = { date: "", total: 0, byIp: new Map() };

function today(): Day {
  const date = new Date().toISOString().slice(0, 10);
  if (state.date !== date) {
    state.date = date;
    state.total = 0;
    state.byIp.clear();
  }
  return state;
}

function dailyBudget() {
  const value = Number(process.env.MAX_GENERATIONS_PER_DAY);
  return Number.isFinite(value) && value > 0 ? value : 30;
}

export function canGenerate(ip: string) {
  const day = today();
  return day.total + IMAGES_PER_RUN <= dailyBudget() && (day.byIp.get(ip) ?? 0) < PER_IP_RUNS;
}

export function recordRun(ip: string) {
  const day = today();
  day.total += IMAGES_PER_RUN;
  day.byIp.set(ip, (day.byIp.get(ip) ?? 0) + 1);
}
