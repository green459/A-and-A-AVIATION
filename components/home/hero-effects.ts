/** Shared hero background treatments — a "window frame" vignette darkening
 * (or lightening) the edges of the hero photo so text stays readable
 * without hiding the image entirely. Two tones:
 *
 * - DARK: for hero text that's white/gold (Home [not admin-configurable],
 *   About, Destinations, Blogs, Services listing) — darkens the image edges
 *   so light text pops.
 * - LIGHT: for hero text that's navy (Contact, Service detail) — lightens
 *   the image edges instead, since a dark vignette under dark text is
 *   nearly unreadable.
 *
 * Both are the same shape (radial + 2 linear gradients), just built from a
 * different base color, so a page only has to pick a tone rather than carry
 * its own copy of this CSS. */
function buildVignette(base: string): string {
  return `
    radial-gradient(120% 90% at 50% 55%, transparent 45%, color-mix(in srgb, ${base} 55%, transparent) 78%, color-mix(in srgb, ${base} 95%, transparent) 100%),
    linear-gradient(to right, color-mix(in srgb, ${base} 95%, transparent) 0%, transparent 22%, transparent 78%, color-mix(in srgb, ${base} 90%, transparent) 100%),
    linear-gradient(to bottom, color-mix(in srgb, ${base} 85%, transparent) 0%, transparent 30%)
  `;
}

export const DARK_HERO_OVERLAY = buildVignette("var(--color-ink)");
export const LIGHT_HERO_OVERLAY = buildVignette("white");

/** Inline style for a hero title: the admin-chosen color, a hard outline
 * traced around every glyph in the admin-chosen shadow color, and a soft
 * layered glow behind the whole thing.
 *
 * A drop-shadow alone (the original `--drop-shadow-title` token this
 * replaces — see app/globals.css) only pushes readability so far: it's a
 * soft blur, so a background that's already close to the title's own color
 * right where a letter sits can still swallow it, and every hero photo
 * (especially per-service ones on the Service detail page, which aren't
 * curated the way the handful of fixed page-hero photos are) is different.
 * The `-webkit-text-stroke` outline is what actually guarantees contrast —
 * it's a hard-edged ring around each glyph, so the fill color always reads
 * against it regardless of what's directly behind that pixel. The two
 * drop-shadows layered on top (a tight one for crisp definition, a wide one
 * for an ambient glow) keep it from looking like a flat sticker. */
export function heroTitleStyle(color: string, shadowColor: string) {
  return {
    color,
    WebkitTextStroke: `2px color-mix(in srgb, ${shadowColor} 90%, transparent)`,
    filter: `drop-shadow(0 2px 6px color-mix(in srgb, ${shadowColor} 80%, transparent)) drop-shadow(0 4px 30px color-mix(in srgb, ${shadowColor} 55%, transparent))`,
  };
}

/** A tighter text-shadow for the eyebrow/subtitle — these stay a fixed
 * white (dark-tone heroes) or navy (light-tone heroes) rather than
 * following the admin color picker, but the vignette above is deliberately
 * translucent in the middle of the hero (so the photo still shows through),
 * which can leave them sitting on a locally bright/dark patch of the photo
 * with too little contrast. A small fixed shadow keeps them legible without
 * needing their own color control. */
export const DARK_HERO_SUBTEXT_SHADOW = {
  textShadow: "0 2px 12px rgba(0, 0, 0, 0.7)",
};
export const LIGHT_HERO_SUBTEXT_SHADOW = {
  textShadow: "0 2px 12px rgba(255, 255, 255, 0.85)",
};
