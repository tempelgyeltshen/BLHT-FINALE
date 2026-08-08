export interface SearchResult<T = Record<string, unknown>> {
  collection: string;
  item: T;
}

export interface SearchQuery {
  q: string;
}
