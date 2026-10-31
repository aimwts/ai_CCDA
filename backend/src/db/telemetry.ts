import { db } from "./index";

const sampleIntervalMs = Number(process.env.HISTORY_SAMPLE_INTERVAL_MS || 60_000);
const lastSampleAt = new Map<string, number>();
let lastFailureLogAt = 0;

export async function recordSensorSample(
  sensor: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (!process.env.DATABASE_URL) return;

  const readings = Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => typeof value === "number" && Number.isFinite(value)
    )
  );
  if (!Object.keys(readings).length) return;

  const now = Date.now();
  if (now - (lastSampleAt.get(sensor) || 0) < sampleIntervalMs) return;
  lastSampleAt.set(sensor, now);

  try {
    await db.query(
      `INSERT INTO public.sensor_history (sensor, metric, value)
       SELECT $1, reading.key, reading.value::double precision
       FROM jsonb_each_text($2::jsonb) AS reading`,
      [sensor, JSON.stringify(readings)]
    );
  } catch (error) {
    if (now - lastFailureLogAt >= 30_000) {
      console.error("Unable to save sensor history. Check DATABASE_URL and the Supabase schema.", error);
      lastFailureLogAt = now;
    }
  }
}
