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

export interface QueryParams {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  search?: string;
  filter?: string;
  join?: string;
  [key: string]: any;
}

export interface Paginated<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
}

export interface UserDto {
  id: number | string;
  name?: string;
  email: string;
  avatar?: string;
  [key: string]: any;
}

export interface CurrentUserResponse {
  user: UserDto | null;
  token?: string;
  exp?: number;
}

export interface WebsiteMetadataResponse {
  title?: string;
  description?: string;
  favicon?: string;
  ogImage?: string;
  error?: string;
  [key: string]: any;
}

export interface CheckFrameableResponse {
  frameable: boolean;
  reason?: string;
  xFrameOptions?: string | null;
  csp?: string | null;
  url?: string;
}

export interface SyncGroupsResponse {
  success: boolean;
  groups: Group[];
  error?: string;
}
