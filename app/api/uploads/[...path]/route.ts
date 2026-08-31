import { readFile, stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Next's static `public/` serving (and its /_next/image optimizer, which
// reads local images the same way) snapshots what's in `public/` at process
// start — files written at runtime by lib/upload.ts after that point are
// invisible to it and 404/400 until the next restart. next.config.ts
// rewrites `/uploads/:path*` to this route instead, which always reads the
// file fresh from disk, so newly uploaded images work immediately.
const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  const resolved = path.join(UPLOADS_ROOT, ...segments);
  if (resolved !== UPLOADS_ROOT && !resolved.startsWith(UPLOADS_ROOT + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(resolved).toLowerCase()];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const info = await stat(resolved);
    if (!info.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }
    const data = await readFile(resolved);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        // Filenames are random UUIDs minted per upload (lib/upload.ts) — a
        // given URL's content never changes, so this is safe to cache hard.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
