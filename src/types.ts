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

export interface CreateUrlDto {
  name: string;
  url: string;
  pointToCenter?: boolean;
}

export interface UpdateUrlDto {
  name: string;
  url: string;
  pointToCenter?: boolean;
}

export interface CreateGroupDto {
  name: string;
}

