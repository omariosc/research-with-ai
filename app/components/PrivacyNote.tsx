"use client";

import { useEffect, useState } from "react";
import { STORAGE_PREFIX } from "@/lib/storage";
import { Close } from "./Icons";

const PRIVACY_NOTICE_KEY = `${STORAGE_PREFIX}:privacy-note:v2`;

export function PrivacyNote() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shouldShow = true;
    try {
      shouldShow =
        window.localStorage.getItem(PRIVACY_NOTICE_KEY) !== "seen";
    } catch {
      // Keep the notice visible when browser storage is unavailable.
    }
    queueMicrotask(() => setVisible(shouldShow));
  }, []);

  if (!visible) return null;

  return (
    <aside className="privacy-note" aria-label="Local storage notice">
      <div>
        <strong>Drafts are stored locally, not securely.</strong>
        <p>
          Project names, notes, checklists, and builders use unencrypted local
          storage. Browser extensions or other people using this device may be
          able to read it. Do not enter patient data, secrets, or sensitive
          research details. Storage is separate on each tutorial address.
          There is no account, analytics, advertising, or tracking cookie.
        </p>
      </div>
      <button
        aria-label="Dismiss notice"
        onClick={() => {
          try {
            window.localStorage.setItem(
              PRIVACY_NOTICE_KEY,
              "seen",
            );
          } catch {
            // Dismissing still works for this page view.
          }
          setVisible(false);
        }}
        type="button"
      >
        <Close size={17} />
      </button>
    </aside>
  );
}
