import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import DOMPurify from "isomorphic-dompurify";
import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from "@/lib/image-constraints";

/** Magic-byte signatures for the raster types above — the declared
 * `file.type` is client-supplied and easily spoofed, so it's only used to
 * pick which signature to check, not trusted on its own. */
function matchesRasterSignature(type: string, buffer: Buffer): boolean {
  switch (type) {
    case "image/png":
      return buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
    case "image/jpeg":
      return (
        buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
      );
    case "image/gif":
      return (
        buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
        buffer.subarray(0, 6).toString("ascii") === "GIF89a"
      );
    case "image/webp":
      return (
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP"
      );
    default:
      return true;
  }
}

/** Saves an uploaded image under public/uploads/<category>/ and returns its public path. */
export async function saveUploadedImage(
  file: File,
  category: string,
): Promise<string> {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) {
    throw new Error("Unsupported image type. Use JPG, PNG, WEBP, GIF or SVG.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  let buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "image/svg+xml") {
    // SVG is served statically from /uploads — sanitize it as if it were
    // untrusted HTML (it can carry <script>/event-handler JS), even though
    // only admins can upload it.
    const sanitized = DOMPurify.sanitize(buffer.toString("utf-8"), {
      USE_PROFILES: { svg: true, svgFilters: true },
    });
    buffer = Buffer.from(sanitized, "utf-8");
  } else if (!matchesRasterSignature(file.type, buffer)) {
    throw new Error("File content doesn't match its declared image type.");
  }

  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", category);
  await mkdir(dir, { recursive: true });

  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${category}/${filename}`;
}
