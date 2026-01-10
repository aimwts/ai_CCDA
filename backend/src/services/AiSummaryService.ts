// src/services/AiSummaryService.ts

export class AiSummaryService {
  constructor(private app: any) {
    this.startSummaryLoop();
  }

  startSummaryLoop() {
    setInterval(async () => {
      const snapshot = {
        plant: this.app.plant?.latest,
        sensehat: this.app.sensehat?.latest,
        system: this.app.system?.latest,
        zones: this.app.zones?.latest
      };

      const rec = await this.app.ai.generateRecommendation(
        `Provide a short executive summary of the system state:\n${JSON.stringify(snapshot)}`
      );

      this.app.realtime.broadcast("ai_summary", {
        type: "ai_summary",
        summary: rec,
        severity: this.detectSeverity(rec)
      });
    }, 15000);
  }

  detectSeverity(text: string) {
    const t = text.toLowerCase();

    if (t.includes("critical") || t.includes("urgent") || t.includes("failure"))
      return "critical";

    if (t.includes("warning") || t.includes("elevated") || t.includes("rising"))
      return "warning";

    return "normal";
  }
}
