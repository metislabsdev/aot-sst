import { AxiosInstance, AxiosResponse } from "axios";

export class HttpService {
  constructor(private readonly httpClient: AxiosInstance) {}

  async get(url: string): Promise<AxiosResponse> {
    return this.httpClient.get(url);
  }
}
