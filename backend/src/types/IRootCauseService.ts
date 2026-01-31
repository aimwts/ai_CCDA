import { IAiService } from "./IAiService";

export interface IRootCauseService extends IAiService {
  analyzeRootCause(context: string): Promise<string>;
}
