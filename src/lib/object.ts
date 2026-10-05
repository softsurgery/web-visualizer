/**
 * Deeply sets a value in an object given a dot-separated path.
 */
export function setDeepValue<T extends Record<string, any>>(
  obj: T,
  path: string,
  value: any,
): T {
  if (!path) return obj;
  const keys = path.split(".");
  const result = { ...obj } as any;
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] =
      current[key] && typeof current[key] === "object"
        ? { ...current[key] }
        : {};
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
}
