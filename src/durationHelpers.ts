import { DateTime, ToRelativeUnit } from 'luxon';
import { ParserUnit } from './types';

export function getPastDate(unit: ToRelativeUnit, amount: number): Date {
  const date = DateTime.fromJSDate(new Date())
    .minus({ [unit]: amount })
    .toJSDate();
  return date;
}

export function parserUnitToLuxonUnit(unit: ParserUnit): ToRelativeUnit {
  switch (unit) {
    case ParserUnit.d:
      return 'days';
    case ParserUnit.w:
      return 'weeks';
    case ParserUnit.m:
      return 'months';
    case ParserUnit.y:
      return 'years';
  }
  return null;
}

export function durationToDate(duration: string): Date {
  const extractedUnit = duration.slice(-1);
  const unit = parserUnitToLuxonUnit(extractedUnit as ParserUnit);
  const amount = Number(duration.slice(0, -1));
  return getPastDate(unit, amount);
}
