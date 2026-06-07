const blockedPatterns = [
  /ignore\s+previous\s+instructions/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /export\s+confidential/i,
  /bypass\s+(rbac|access|policy)/i
];

export function inspectPrompt(input: string) {
  const hits = blockedPatterns.filter((pattern) => pattern.test(input));

  return {
    allowed: hits.length === 0,
    risk: hits.length > 0 ? "high" : input.length > 900 ? "medium" : "low",
    reasons: hits.map((pattern) => pattern.source)
  };
}

export function redactSensitiveText(text: string) {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[redacted-number]");
}
