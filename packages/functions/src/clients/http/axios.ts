import axios, { AxiosResponse } from "axios";
import rateLimit from "axios-rate-limit";

// Create an instance of the Axios client with rate limiting
const client = rateLimit(axios.create(), {
  maxRequests: 10, // Max 10 requests
  perMilliseconds: 1000, // per 1 second
  maxRPS: 5, // Max 2 requests per second
});

export async function get<T>(url: string): Promise<T> {
  try {
    const { data } = await client.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching data:", { error });
    throw new Error("Error fetching");
  }
}

export async function fetchAllResults<T>(
  url: string,
  limit: number = 10,
  API_KEY: string,
  source?: string
): Promise<T[]> {
  let callNumber = 0;
  let offset = 0;
  let transactions: T[] = [];

  console.time(`fetchAllResults`);
  while (true) {
    try {
      const response = await client.get(url, {
        params: {
          limit,
          ...(source === "UNISAT" ? { start: offset } : { offset }),
        },
        headers: {
          ...(source === "UNISAT"
            ? { Authorization: `Bearer ${API_KEY}` }
            : { "x-api-key": API_KEY }),
        },
      });

      // TODO: Move this to the methods that call this function.
      if (source === "UNISAT") {
        const {
          data: { detail },
        } = response.data;

        return detail;
      } else {
        const { data } = response;
        const { total, results } = data;
        transactions.push(...results);
        if (total <= transactions.length) {
          // No more results to fetch
          break;
        }
        callNumber++;
        offset += limit;
      }
    } catch (error) {
      console.error("Error fetching results:", { error });
      throw new Error("Error fetching results");
      break;
    }
  }

  console.timeEnd(`fetchAllResults`);
  return transactions;
}
