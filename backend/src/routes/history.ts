import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/:sensor", async (req, res) => {
  const sensor = req.params.sensor;
  const hours = Number(req.query.hours || 24);

  const result = await db.query(
    "SELECT sensor, value, timestamp FROM sensor_history WHERE sensor = $1 AND timestamp > NOW() - INTERVAL $2 HOUR ORDER BY timestamp ASC",
    [sensor, hours]
  );

  res.json(result.rows);
});

export default router;
