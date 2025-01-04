import axios, { AxiosInstance, AxiosResponse } from "axios";
import axiosRateLimit from "axios-rate-limit";

export class HttpService {
  private readonly client: AxiosInstance;
  constructor() {
    this.client = axiosRateLimit(axios.create(), {
      maxRequests: 10, // Max 10 requests
      perMilliseconds: 1000, // per 1 second
      maxRPS: 5, // Max 2 requests per second
    });
  }
  public async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.client.get(url);
      return data;
    } catch (error) {
      console.error("Error fetching data:", { error });
      throw new Error("Error fetching");
    }
  }

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
