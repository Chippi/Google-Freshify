import { DAYS, MONTHS, WEEKS } from '../CONSTANTS';

enum ParserUnit {
  y = 'y',
  m = 'm',
  w = 'w',
  d = 'd',
}

export function parser(query: string): { hit: string; step: number } {
  const parsed = query.match(/\|(\d+)(\w).*$/);

  if (parsed) {
    const [hit, count, unit] = parsed;
    const step = getStep(unit as ParserUnit, parseFloat(count));
    if (step === null) {
      return null;
    }
    return { step, hit };
  }
  return null;
}

function getStep(unit: ParserUnit, count): number {
  switch (unit) {
    case ParserUnit.d:
      return count;
    case ParserUnit.w:
      return count + DAYS;
    case ParserUnit.m:
      return count + DAYS + WEEKS;
    case ParserUnit.y:
      return count + DAYS + WEEKS + MONTHS;
  }
  return null;
}
