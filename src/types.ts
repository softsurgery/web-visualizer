export interface UrlEntry {
  url: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  urls: UrlEntry[];
}
