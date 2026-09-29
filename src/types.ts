export interface UrlEntry {
  url: string;
  name: string;
  pointToCenter?: boolean;
}

export interface Group {
  id: string;
  name: string;
  urls: UrlEntry[];
}
