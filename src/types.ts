export interface UrlEntry {
  url: string;
  name: string;
  pointToCenter?: boolean;
}

export type LayoutType = "lg" | "md" | "sm" | "list";

export interface Group {
  id: string;
  name: string;
  urls: UrlEntry[];
  layout?: LayoutType;
}
