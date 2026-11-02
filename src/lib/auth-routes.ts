export const LOGIN_PATH = "/admin/login";

export function loginRedirectPath(returnTo = "/"): string {
  return `${LOGIN_PATH}?redirect=${encodeURIComponent(returnTo)}`;
}

export function isPublicAppPath(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }
  return pathname.startsWith("/share");
}
