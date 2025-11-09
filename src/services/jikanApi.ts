import { JikanResponse, Anime } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export class JikanAPI {
  private static abortController: AbortController | null = null;

  static async searchAnime(
    query: string,
    page: number = 1
  ): Promise<JikanResponse> {
    // Cancel previous request
    if (this.abortController) {
      this.abortController.abort();
    }

    // Create new abort controller
    this.abortController = new AbortController();

    try {
      const response = await fetch(
        `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`,
        { signal: this.abortController.signal }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: JikanResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw error;
    }
  }

  static async getAnimeById(id: number): Promise<Anime> {
    const response = await fetch(`${BASE_URL}/anime/${id}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  static cancelRequests(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}