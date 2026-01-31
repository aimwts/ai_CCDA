import { IAiService } from "./IAiService";

export interface IAiRecommendationService {
  generateRecommendation(input: string): Promise<string[]>;
}

