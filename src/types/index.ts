export interface City {
  name: string;
  country: string;
  population: number;
  latitude: number;
  longitude: number;
}

export interface Destination {
  city: string;
  country: string;
  imageUrl: string;
  description: string;
  wikiUrl?: string;
}

export interface WikipediaResponse {
  extract: string;
  thumbnail?: string;
  url?: string;
}

export interface SearchResult extends Destination {
  loading?: boolean;
}