/** Which importer a pasted export belongs to (Settings → Import).
 *
 * A CSV export is recognised by an ``object_name`` cell in its header line,
 * wherever the column sits. The check used to be ``startsWith("object_name")``,
 * and since 2.100.0 the export's first column is ``object_entry_id``: the
 * panel sent its own CSV export to the JSON/YAML importer, which refused it.
 * A UTF-8 byte-order mark (a spreadsheet's "CSV UTF-8" save) and quoted
 * header cells are tolerated; JSON (`{`/`[`) and YAML (`version: …`) never
 * have a bare ``object_name`` cell in their first line.
 */
export function isCsvExport(content: string): boolean {
  const header = content.replace(/^\uFEFF/, "").trimStart().split(/\r?\n/, 1)[0] ?? "";
  return header
    .split(",")
    .some((cell) => cell.trim().replace(/^"(.*)"$/, "$1") === "object_name");
}
