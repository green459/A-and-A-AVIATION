"use client";

import { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function DeleteButton({
  id,
  action,
  confirmLabel,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  confirmLabel: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="font-medium text-red-600 hover:underline"
        >
          Delete
        </button>
      </form>

      <ConfirmDialog
        open={confirming}
        title="Delete this?"
        message={confirmLabel}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
