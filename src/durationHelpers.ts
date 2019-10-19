import { DateTime, ToRelativeUnit } from 'luxon';
import { ParserUnit } from './types';

export function getPastDate(unit: ParserUnit, amount: number): Date {
  const relativeUnit = parserUnitToLuxonUnit(unit);
  const date = DateTime.fromJSDate(new Date())
    .minus({ [relativeUnit]: amount })
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
  const { unit, amount } = parseDuration(duration);
  return getPastDate(unit, amount);
}

export function durationToText(duration: string) {
  const { unit, amount } = parseDuration(duration);
  return `${amount} ${unitToText(unit, amount)}`
}

function unitToText(unit, amount){
  switch (unit) {
    case ParserUnit.d:
      return (amount === 1) ? 'day' : 'days'
    case ParserUnit.w:
      return (amount === 1) ? 'week' : 'weeks'
    case ParserUnit.m:
      return (amount === 1) ? 'month' : 'months'
    case ParserUnit.y:
      return (amount === 1) ? 'year' : 'years'
  }
}

function parseDuration(duration: string): { unit: ParserUnit, amount: number } {
  const unit = duration.slice(-1);
  return {
    unit: unit as ParserUnit,
    amount: Number(duration.slice(0, -1))
  }

}