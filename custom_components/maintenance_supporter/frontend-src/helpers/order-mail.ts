/**
 * #265: several parts ordered by e-mail in one message.
 *
 * A part whose link is `mailto:address` opens an e-mail for that part alone
 * (the server writes that link). The parts ticked in the parts section go into
 * one e-mail per address instead, each with the lines the server wrote for it
 * (`order_lines`, helpers/parts.py), so a supplier gets one order.
 *
 * A link that brings its own subject or text keeps them: its subject stands,
 * its text comes first (a customer number, a greeting), and the other fields
 * (cc, bcc) ride along. The first ticked part of an address decides.
 */

export interface MailOrderPart {
  id: string;
  name: string;
  product_url?: string | null;
  order_lines?: string[] | null;
}

export interface OrderMail {
  address: string;
  url: string;
  partIds: string[];
}

const MAILTO = /^mailto:([^?\s]+@[^?\s]+)(?:\?(.*))?$/i;

const decode = (s: string): string => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** The address of a `mailto:` link, null for any other link. */
export function mailAddress(url: string | null | undefined): string | null {
  const m = MAILTO.exec((url ?? "").trim());
  return m ? decode(m[1]) : null;
}

/** The fields of a `mailto:` link's own query, names lower-cased. */
function ownFields(url: string): [string, string][] {
  const query = MAILTO.exec(url.trim())?.[2] ?? "";
  return query
    .split("&")
    .filter(Boolean)
    .map((pair) => {
      const at = pair.indexOf("=");
      return at < 0 ? [decode(pair).toLowerCase(), ""] : [decode(pair.slice(0, at)).toLowerCase(), decode(pair.slice(at + 1))];
    });
}

/** Whether a part can go into an order e-mail. */
export function isMailOrderPart(part: MailOrderPart): boolean {
  return !!mailAddress(part.product_url) && !!part.order_lines?.length;
}

/** One e-mail per address for the given parts, in the order they come. */
export function orderMails(parts: MailOrderPart[]): OrderMail[] {
  const groups = new Map<string, { address: string; link: string; parts: MailOrderPart[] }>();
  for (const part of parts) {
    if (!isMailOrderPart(part)) continue;
    const address = mailAddress(part.product_url)!;
    const key = address.toLowerCase();
    const group = groups.get(key) ?? { address, link: part.product_url!, parts: [] };
    group.parts.push(part);
    groups.set(key, group);
  }
  return [...groups.values()].map(({ address, link, parts: list }) => {
    const own = ownFields(link);
    const subject = own.find(([k]) => k === "subject")?.[1] || list.map((p) => p.name).join(", ");
    const preamble = own.find(([k]) => k === "body")?.[1];
    const order = list.map((p) => p.order_lines!.join("\n")).join("\n\n");
    const fields: [string, string][] = [
      ["subject", subject],
      ...own.filter(([k]) => k !== "subject" && k !== "body"),
      ["body", preamble ? `${preamble}\n\n${order}` : order],
    ];
    const query = fields.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
    return { address, url: `mailto:${address}?${query}`, partIds: list.map((p) => p.id) };
  });
}
