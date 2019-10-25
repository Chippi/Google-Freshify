import { ParserUnit } from '../CONSTANTS';

export function parser(query: string): { query: string, amount: number, unit: ParserUnit } {
  const parsed = query.match(/(.*)\|(\d+)(\w).*$/);
  if (parsed) {
    const [_, stripedQuery, amount, unit] = parsed;
    return {
      query: stripedQuery,
      amount: Number(amount),
      unit: unit as ParserUnit,
    };
  }
  return null;
}
