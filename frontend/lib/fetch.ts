// wrap fetch to simplfy places that retrieve data
export const get = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const data = (await res.json()) as T;
  return data;
};
