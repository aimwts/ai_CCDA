import { IAiService } from "./IAiService";

export interface IRecommendationFeedService extends IAiService {
  generateFeedItem(context: string): Promise<string>;
}
