import { IAiService } from "./IAiService";

export interface ISummaryService extends IAiService {
  summarize(context: string): Promise<string>;
}
