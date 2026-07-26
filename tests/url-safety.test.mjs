import assert from "node:assert/strict";
import test from "node:test";
import {
  publicUrlIssue,
  redactSensitiveUrl,
  urlContainsSecret,
} from "../lib/url-safety.ts";

test("public URL validation accepts ordinary paper and repository links", () => {
  assert.equal(
    publicUrlIssue(
      "https://doi.org/10.1038/s41597-022-01721-8",
      "paper",
    ),
    null,
  );
  assert.equal(
    publicUrlIssue("https://github.com/MedMNIST/experiments", "repository"),
    null,
  );
});

test("credential and signed URLs are rejected before browser persistence", () => {
  const unsafe = [
    "https://user:token@github.com/org/repo",
    "https://example.com/file?token=secret",
    "https://example.com/file?X-Amz-Signature=secret",
    "https://example.com/file?X-Goog-Credential=secret",
    "https://example.com/file?sig=secret",
    "https://example.com/callback#access_token=secret",
  ];

  for (const url of unsafe) {
    assert.equal(urlContainsSecret(url), true, url);
    assert.match(publicUrlIssue(url, "repository"), /Remove/);
    assert.equal(redactSensitiveUrl(url), "");
  }
});

test("lookalike non-secret query names are not over-blocked", () => {
  const url = "https://example.com/paper?monkey=1&designation=review";
  assert.equal(urlContainsSecret(url), false);
  assert.equal(publicUrlIssue(url, "paper"), null);
});
