const sensitiveUrlKey =
  /(?:^|[-_.])(?:access[-_]?token|api[-_]?key|auth(?:orization)?|credential|key|password|secret|sig(?:nature)?|token)(?:$|[-_.])/i;

function sensitiveParameter(url: URL) {
  const queryKeys = [...url.searchParams.keys()];
  const fragmentKeys = url.hash.includes("=")
    ? [...new URLSearchParams(url.hash.slice(1)).keys()]
    : [];
  return [...queryKeys, ...fragmentKeys].find((key) =>
    sensitiveUrlKey.test(key),
  );
}

export function urlContainsSecret(value: string) {
  try {
    const url = new URL(value.trim());
    return Boolean(
      url.username || url.password || sensitiveParameter(url),
    );
  } catch {
    return false;
  }
}

export function redactSensitiveUrl(value: string) {
  return urlContainsSecret(value) ? "" : value;
}

export function publicUrlIssue(value: string, label: string) {
  try {
    const url = new URL(value.trim());
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      !url.hostname.includes(".") ||
      value.includes("...") ||
      url.pathname.includes("/owner/repository")
    ) {
      return `Use a complete http or https URL for the ${label}.`;
    }
    if (url.username || url.password) {
      return `Remove usernames, passwords, and tokens from the ${label} URL.`;
    }
    const parameter = sensitiveParameter(url);
    if (parameter) {
      return `Remove the sensitive ${parameter} parameter from the ${label} URL.`;
    }
    return null;
  } catch {
    return `Use a complete http or https URL for the ${label}.`;
  }
}
