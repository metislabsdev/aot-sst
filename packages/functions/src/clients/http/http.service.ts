import axios, { AxiosInstance, AxiosResponse } from "axios";
import axiosRateLimit from "axios-rate-limit";

/**
 * Service for making HTTP requests with rate limiting
 */
export class HttpService {
  private readonly client: AxiosInstance;

  /**
   * Creates an instance of HttpService with rate-limited Axios client
   * @param baseUrl - Base URL for API requests
   * @param method - HTTP method to be used
   * @param headers - HTTP headers to include in requests
   * @param params - Query parameters to include in requests
   * @param apiKey - API key for authentication
   */
  constructor() {
    this.client = axiosRateLimit(axios.create(), {
      maxRequests: 10,
      perMilliseconds: 1000,
      maxRPS: 5,
    });
  }

  /**
   * Performs a GET request and returns the response data
   * @param url - The URL to fetch from
   * @returns Promise containing the response data
   * @throws Error if the request fails
   */
  public async get<T>(url: string, config?: Record<string, any>): Promise<T> {
    try {
      const { data } = await this.client.get(url, config);
      return data;
    } catch (error) {
      console.error("Error fetching data:", { error });
      throw new Error("Error fetching");
    }
  }

  /**
   * Fetches all paginated results from an endpoint
   * @param url - The base URL to fetch from
   * @param limit - Number of items per page (default: 10)
   * @param headers - Additional headers to include in the request
   * @param params - Additional query parameters
   * @param API_KEY - API key for authentication
   * @param source - Optional source identifier
   * @returns Promise containing array of all results
   * @throws Error if the request fails
   */
  public async fetchAllResults<T>(
    url: string,
    limit: number = 10,
    headers: Record<string, string> = {},
    params: Record<string, string> = {},
    API_KEY: string,
    source?: string
  ): Promise<T[]> {
    let callNumber = 0;
    let offset = 0;
    let transactions: T[] = [];

    console.time(`fetchAllResults`);
    while (true) {
      try {
        const response = await this.client.get(url, {
          params: {
            limit,
            ...params,
          },
          headers: {
            ...headers,
          },
        });

        const { data } = response;
        const { total, results } = data;
        transactions.push(...results);
        if (total <= transactions.length) {
          // No more results to fetch
          break;
        }
        callNumber++;
        offset += limit;
      } catch (error) {
        console.error("Error fetching results:", { error });
        throw new Error("Error fetching results");
        break;
      }
    }
    console.timeEnd(`fetchAllResults`);
    return transactions;
  }
}
