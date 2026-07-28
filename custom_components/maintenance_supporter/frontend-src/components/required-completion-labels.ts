/** Details a task can demand on completion — the frontend's mirror of
 *  `helpers/completion_requirements.REQUIRABLE_COMPLETION_FIELDS`.
 *
 *  Shared by the task dialog (which picks them) and the completion dialog
 *  (which marks them and names the missing ones), so the two can never offer
 *  and demand different sets.
 *
 *  The labels map exists because the field keys are NOT locale keys: looking
 *  them up directly rendered the raw strings "notes", "photo" and "user" in
 *  all 22 languages, since only `cost` and `duration` happen to exist as
 *  keys. The t()-usage CI gate could not see it — that gate only reads
 *  translation calls whose key is a quoted string literal, and the offending
 *  code passed a variable instead.
 */

export const REQUIRED_COMPLETION_KEYS = ["notes", "cost", "duration", "photo", "user"] as const;

export type RequiredCompletionField = (typeof REQUIRED_COMPLETION_KEYS)[number];

/** Field key → the locale key holding its short, translated label. */
export const REQUIRED_COMPLETION_LABELS: Record<string, string> = {
  notes: "notes_label",
  cost: "cost",
  duration: "duration",
  photo: "photo_label",
  user: "user_label",
};
