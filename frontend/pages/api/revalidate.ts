import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const changes = (request.query.changes as string | undefined)?.split(",");
  if (changes) {
    const paths = new Set<string>();
    changes.forEach((source) => {
      switch (source) {
        case "plays":
          paths.add("/insights");
          paths.add("/mostplayed");
          break;
        case "recentplays":
          paths.add("/overview");
          break;
        case "topten":
          paths.add("/topten");
          break;
        case "stats":
          paths.add("/overview");
          break;
        case "collection":
          paths.add("/collection");
          break;
      }
    });
    paths.forEach(async (path) => {
      await response.revalidate(path);
    });

    return response.json({ revalidated: true });
  }
  return response.json({ revalidated: false });
}
