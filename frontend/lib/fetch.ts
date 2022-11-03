// // using undici directly with cache() until the fetch() bug in Next 13 server components is fixed.
// export const get = cache(async <T>(url: string) => {
//   console.log(`GET ${url}`);
//   const { body } = await request(url);
//   const data = (await body.json()) as T;
//   return data;
// });

// wrap fetch
export const get = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const data = (await res.json()) as T;
  return data;
};
