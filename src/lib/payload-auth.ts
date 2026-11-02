import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { User } from "../../payload-types";

export async function getPayloadUser(): Promise<User | null> {
  const payload = await getPayload({ config: configPromise });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });
  return user ?? null;
}

export { loginRedirectPath } from "./auth-routes";
