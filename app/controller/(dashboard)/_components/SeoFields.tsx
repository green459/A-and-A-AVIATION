import { FormField, TextInput, TextArea } from "./FormField";

/** Optional per-item SEO overrides, shared by Service/Blog/Destination forms.
 * Left blank, the public page falls back to the item's own title/tagline. */
export default function SeoFields({
  metaTitle,
  metaDescription,
}: {
  metaTitle?: string | null;
  metaDescription?: string | null;
}) {
  return (
    <details className="rounded-lg border border-gray-200 p-4">
      <summary className="cursor-pointer text-sm font-medium text-gray-700">
        SEO (optional)
      </summary>
      <div className="mt-4 flex flex-col gap-4">
        <FormField id="metaTitle" label="Meta title">
          <TextInput
            id="metaTitle"
            name="metaTitle"
            defaultValue={metaTitle ?? ""}
            placeholder="Leave blank to use the title above"
          />
        </FormField>
        <FormField id="metaDescription" label="Meta description">
          <TextArea
            id="metaDescription"
            name="metaDescription"
            rows={2}
            defaultValue={metaDescription ?? ""}
            placeholder="Leave blank to use the tagline/excerpt above"
          />
        </FormField>
      </div>
    </details>
  );
}
