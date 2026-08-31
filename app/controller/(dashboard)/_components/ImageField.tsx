"use client";

import { useState } from "react";
import Image from "next/image";
import { ALLOWED_IMAGE_ACCEPT, validateImageFile } from "@/lib/image-constraints";

export default function ImageField({
  currentImage,
  required,
}: {
  currentImage?: string;
  required?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="image" className="text-sm font-medium text-gray-700">
        Image {!required && <span className="text-gray-400">(optional — keeps current if left empty)</span>}
      </label>
      <input
        id="image"
        name="image"
        type="file"
        accept={ALLOWED_IMAGE_ACCEPT}
        required={required}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const message = validateImageFile(file);
          if (message) {
            setError(message);
            setPreview(null);
            e.target.value = "";
            return;
          }

          setError(null);
          setPreview(URL.createObjectURL(file));
        }}
        className="text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-hover"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {(preview || currentImage) && (
        <div className="relative mt-2 h-32 w-full max-w-xs overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={preview ?? currentImage!}
            alt="Preview"
            fill
            sizes="320px"
            className="object-cover"
            unoptimized={!!preview}
          />
        </div>
      )}
    </div>
  );
}
