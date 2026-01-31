export interface IAiService {
  generate(prompt: string): Promise<string>;
}
