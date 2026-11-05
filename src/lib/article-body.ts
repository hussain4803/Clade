export type BodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

/**
 * Parses the lightweight article markup stored in the database:
 * blank-line separated blocks; "## " headings; "> " quotes (optional "— cite" last line); "- " lists.
 */
export function parseArticleBody(body: string): BodyBlock[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map<BodyBlock>((chunk) => {
      if (chunk.startsWith("## ")) return { type: "heading", text: chunk.slice(3).trim() };
      const lines = chunk.split("\n").map((l) => l.trim());
      if (lines.every((l) => l.startsWith("- "))) {
        return { type: "list", items: lines.map((l) => l.slice(2).trim()) };
      }
      if (lines.every((l) => l.startsWith(">"))) {
        const text = lines.map((l) => l.replace(/^>\s?/, ""));
        const last = text[text.length - 1] ?? "";
        if (text.length > 1 && /^[—-]\s/.test(last)) {
          return { type: "quote", text: text.slice(0, -1).join(" "), cite: last.replace(/^[—-]\s/, "") };
        }
        return { type: "quote", text: text.join(" ") };
      }
      return { type: "paragraph", text: lines.join(" ") };
    });
}
