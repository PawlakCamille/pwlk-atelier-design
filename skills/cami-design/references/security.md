# Security Spot-Check

Deep reference for the security pass in `cami-design-engineer`. Loaded when the diff touches rendered HTML, external links, browser APIs, or logging.

Not a full security audit — that's a specialist's job. This is the short checklist a receiving tech team expects to have been run. Most passes return clean; the value is that the question was asked. Four checks:

## HTML Injection

A new `dangerouslySetInnerHTML`, `innerHTML` assignment, or framework equivalent — especially fed by user input, i18n strings, or API content. Flag it; the content needs sanitizing or the API needs to be a plain string.

## External Link Missing `rel`

`target="_blank"` without `rel="noopener noreferrer"`. The opened page gets a handle back to the opener via `window.opener` — a tabnabbing vector. Add the `rel`.

## Browser API Scope

New use of clipboard, file, camera, microphone, or geolocation APIs. Confirm the scope is the minimum the feature needs and that it's gated behind explicit user action, not fired on mount.

## Leaked Values

Tokens, signed URLs, PII, or secrets that get logged (`console.log`), persisted (`localStorage`, a cache with a long TTL), or sent somewhere they shouldn't be. Flag the value and the sink.

## Attribution

Synthesized from the Anthropic Code Review security pass and OWASP front-end basics.
