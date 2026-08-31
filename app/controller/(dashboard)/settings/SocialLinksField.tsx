"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload } from "lucide-react";
import { Select } from "../_components/FormField";
import {
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  type SocialLink,
} from "@/lib/data/social-platforms";
import { ALLOWED_IMAGE_ACCEPT, validateImageFile } from "@/lib/image-constraints";

const EMPTY_ROW: SocialLink = { platform: "facebook", label: "", url: "", icon: "" };

/** Add/edit/remove rows of {platform, label, url, icon}. Submits parallel
 * arrays (social_platform / social_label / social_url / social_existingIcon
 * / social_newIcon) so the server action can zip them back together by
 * index — same pattern as ImageListField. A `social_newIcon` file input is
 * always present per row (even when hidden) so every array stays the same
 * length and indices line up.
 *
 * Wrapped below with a `key` derived from `defaultValues` (see the default
 * export) — see that wrapper's comment for why. */
function SocialLinksFieldInner({
  defaultValues,
}: {
  defaultValues?: SocialLink[];
}) {
  const [rows, setRows] = useState<SocialLink[]>(
    defaultValues && defaultValues.length > 0 ? defaultValues : [EMPTY_ROW],
  );
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({});
  const [iconErrors, setIconErrors] = useState<Record<number, string>>({});

  const updatePlatform = (index: number, platform: SocialLink["platform"]) => {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, platform } : row)),
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3"
          >
            <div className="flex flex-col gap-2 @lg:flex-row @lg:items-center">
              <div className="@lg:w-40">
                <Select
                  name="social_platform"
                  value={row.platform}
                  onChange={(v) =>
                    updatePlatform(index, v as SocialLink["platform"])
                  }
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {SOCIAL_PLATFORM_LABELS[platform]}
                    </option>
                  ))}
                </Select>
              </div>

              {row.platform === "other" ? (
                <input
                  name="social_label"
                  defaultValue={row.label}
                  placeholder="Label, e.g. Telegram"
                  className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy @lg:w-40"
                />
              ) : (
                <input type="hidden" name="social_label" value="" />
              )}

              <input
                name="social_url"
                type="url"
                required
                defaultValue={row.url}
                placeholder="https://..."
                className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />

              <button
                type="button"
                onClick={() =>
                  setRows((current) =>
                    current.length > 1
                      ? current.filter((_, i) => i !== index)
                      : current,
                  )
                }
                aria-label="Remove"
                className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 sm:self-auto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <input
              type="hidden"
              name="social_existingIcon"
              value={row.icon}
            />
            {row.platform === "other" && (
              <div className="flex items-center gap-3 pl-1">
                {(iconPreviews[index] || row.icon) && (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-200">
                    <Image
                      src={iconPreviews[index] ?? row.icon}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                      unoptimized={!!iconPreviews[index]}
                    />
                  </div>
                )}
                <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-navy hover:text-gold">
                  <Upload className="h-3.5 w-3.5" />
                  Custom icon (optional)
                  <input
                    type="file"
                    name="social_newIcon"
                    accept={ALLOWED_IMAGE_ACCEPT}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const message = validateImageFile(file);
                      if (message) {
                        setIconErrors((current) => ({ ...current, [index]: message }));
                        e.target.value = "";
                        return;
                      }

                      setIconErrors((current) => {
                        const next = { ...current };
                        delete next[index];
                        return next;
                      });
                      setIconPreviews((current) => ({
                        ...current,
                        [index]: URL.createObjectURL(file),
                      }));
                    }}
                  />
                </label>
                {iconErrors[index] && (
                  <p role="alert" className="text-xs text-red-600">
                    {iconErrors[index]}
                  </p>
                )}
              </div>
            )}
            {row.platform !== "other" && (
              <input type="file" name="social_newIcon" className="hidden" />
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRows((current) => [...current, EMPTY_ROW])}
        className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-navy hover:text-gold"
      >
        <Plus className="h-4 w-4" />
        Add link
      </button>
    </div>
  );
}

/** `rows` above only reads `defaultValues` once, on mount — React doesn't
 * re-run a `useState` initializer when props change on a later render. So
 * once the admin edits a row (or adds a new blank one), the field is
 * disconnected from `defaultValues` for the rest of that page's lifetime.
 * That's normally fine (uncontrolled inputs are meant to own their own
 * value) — except React *also* resets every uncontrolled field in a
 * submitted form back to its `defaultValue` prop once the action settles.
 * Combined, a brand-new row's `defaultValue` is still "" from when it was
 * added, and any label/URL just typed into it gets wiped back to blank
 * right after a successful save, even though the save actually worked.
 * Keying on `defaultValues`'s content forces a full remount exactly when
 * the parent hands down genuinely new (post-save, revalidated) data —
 * reinitializing `rows` from the real saved values instead of the stale
 * local ones, so the reset lands on the correct content instead of erasing
 * it. */
export default function SocialLinksField(
  props: Parameters<typeof SocialLinksFieldInner>[0],
) {
  return (
    <SocialLinksFieldInner key={JSON.stringify(props.defaultValues)} {...props} />
  );
}
