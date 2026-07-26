"use client";

import { useState } from "react";
import { STORAGE_PREFIX } from "@/lib/storage";

export function ClearLocalDataButton() {
  const [status, setStatus] = useState<"idle" | "cleared" | "unavailable">(
    "idle",
  );

  function clearLocalData() {
    try {
      const keys = Array.from(
        { length: window.localStorage.length },
        (_, index) => window.localStorage.key(index),
      ).filter(
        (key): key is string =>
          typeof key === "string" &&
          (key.startsWith(STORAGE_PREFIX) || key === "research-with-ai:theme"),
      );
      keys.forEach((key) => window.localStorage.removeItem(key));
      setStatus("cleared");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <button className="clear-data-button" onClick={clearLocalData} type="button">
      {status === "cleared"
        ? "Tutorial data cleared on this address"
        : status === "unavailable"
          ? "Browser storage is unavailable"
          : "Clear tutorial data on this address"}
    </button>
  );
}
