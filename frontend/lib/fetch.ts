import { cache } from "react";
import { request } from "undici";

// using undici directly with cache() until the fetch() bug in Next 13 server components is fixed.
export const get = cache(async <T>(url: string) => {
  console.log(`GET ${url}`);
  const { body } = await request(url);
  const data = (await body.json()) as T;
  return data;
});
