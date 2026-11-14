/**
 * The delete-object confirmation text, with what the delete hands on (D#256).
 *
 * Spare parts other objects draw on are not deleted with their owner: they
 * move to one of those objects. Home Assistant said so afterwards, in a
 * repair notice; the dialog now says it before, so nobody has to wonder
 * whether the stock is lost. The preview is best effort: when it cannot be
 * read the plain question is asked, and the repair notice still follows.
 */

import { t } from "../styles";

interface PartsHandover {
  new_owner: string;
  parts: string[];
}

interface PreviewHost {
  connection: { sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> };
}

export async function deleteObjectMessage(hass: PreviewHost, entryId: string | null | undefined, lang: string): Promise<string> {
  const base = t("delete_object_confirm", lang);
  if (!entryId) return base;
  try {
    const res = await hass.connection.sendMessagePromise<{ parts_handover: PartsHandover | null }>({
      type: "maintenance_supporter/object/delete_preview",
      entry_id: entryId,
    });
    const handover = res?.parts_handover;
    if (!handover || !handover.parts?.length) return base;
    const note = t("delete_object_parts_move", lang)
      .replace("{parts}", handover.parts.join(", "))
      .replace("{object}", handover.new_owner);
    return `${base} ${note}`;
  } catch {
    return base;
  }
}
