"use client";

import { useEffect, useState } from "react";
import { STORAGE_PREFIX } from "@/lib/storage";
import { Close } from "./Icons";

export function PrivacyNote() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shouldShow =
      window.localStorage.getItem(`${STORAGE_PREFIX}:privacy-note`) !== "seen";
    queueMicrotask(() => setVisible(shouldShow));
  }, []);

  if (!visible) return null;

  return (
    <aside className="privacy-note" aria-label="Local storage notice">
      <div>
        <strong>Your work stays in this browser.</strong>
        <p>
          We use local storage for checklist progress and draft builders. There
          is no account, analytics, advertising, or tracking cookie.
        </p>
      </div>
      <button
        aria-label="Dismiss notice"
        onClick={() => {
          window.localStorage.setItem(
            `${STORAGE_PREFIX}:privacy-note`,
            "seen",
          );
          setVisible(false);
        }}
        type="button"
      >
        <Close size={17} />
      </button>
    </aside>
  );
}
