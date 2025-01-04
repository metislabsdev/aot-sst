export interface PaginationParams {
  limit?: number;
  nextToken?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
}
