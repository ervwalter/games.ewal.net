import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const changes = searchParams.get("changes")?.split(",");

    if (!changes) {
      return NextResponse.json({ revalidated: false, message: "No changes specified" });
    }

    const paths = new Set<string>();
    const tags = new Set<string>();

    changes.forEach((source) => {
      switch (source) {
        case "plays":
          paths.add("/insights");
          paths.add("/mostplayed");
          tags.add("plays");
          break;
        case "recentplays":
          paths.add("/overview");
          tags.add("recent-plays");
          break;
        case "topten":
          paths.add("/topten");
          tags.add("top-ten");
          break;
        case "stats":
          paths.add("/overview");
          tags.add("stats");
          break;
        case "collection":
          paths.add("/collection");
          tags.add("collection");
          break;
      }
    });

    // Revalidate both paths and tags
    await Promise.all([
      ...Array.from(paths).map(path => revalidatePath(path)),
      ...Array.from(tags).map(tag => revalidateTag(tag))
    ]);

    return NextResponse.json({ 
      revalidated: true,
      paths: Array.from(paths),
      tags: Array.from(tags)
    });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json({ 
      revalidated: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
