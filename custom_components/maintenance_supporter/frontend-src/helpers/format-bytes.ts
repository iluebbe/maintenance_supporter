import { formatNumber } from "../styles";

/** Human-readable byte size (B / KB / MB) for document storage figures. */
export function formatBytes(bytes: number | undefined, lang?: string): string {
  const b = bytes ?? 0;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${formatNumber(b / 1024, lang, 1)} KB`;
  return `${formatNumber(b / (1024 * 1024), lang, 1)} MB`;
}
