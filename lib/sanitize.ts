import DOMPurify from "isomorphic-dompurify";

// Allowlist matches the TipTap extensions actually loaded in
// blogs/RichTextEditor.tsx — nothing here can produce script/iframe/raw-HTML
// nodes, but this is a second, independent layer of defense before the
// content ever reaches the public site.
const RICH_TEXT_ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "a",
  "h2", "h3", "ul", "ol", "li", "blockquote", "img",
];
const RICH_TEXT_ALLOWED_ATTR = ["href", "target", "rel", "src", "alt"];

export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ALLOWED_ATTR,
  });
}
