import { IAiService } from "./IAiService";

export interface ITrendService extends IAiService {
  analyzeTrends(context: string): Promise<string>;
}
