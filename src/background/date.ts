import { DateTime, DurationObjectUnits } from 'luxon';
import { DAYS, MONTHS, WEEKS, YEARS } from '../CONSTANTS';

export function calculateDate(rangeVal: number): Date | null {
  const date = new Date();

  if (rangeVal <= DAYS) {
    const days = rangeVal;
    return dateMinus(date, { days });
  }

  if (rangeVal <= DAYS + WEEKS) {
    const weeks = rangeVal - DAYS;
    return dateMinus(date, { weeks });
  }

  if (rangeVal <= DAYS + WEEKS + MONTHS) {
    const months = rangeVal - DAYS - WEEKS;
    return dateMinus(date, { months });
  }

  if (rangeVal <= DAYS + WEEKS + MONTHS + YEARS) {
    const years = rangeVal - DAYS - WEEKS - MONTHS;
    return dateMinus(date, { years });
  }

  console.log('minus nothing; ANYTIME!');
  return null;
}

function dateMinus(date: Date, duration: DurationObjectUnits): Date {
  console.log('minus', duration);

  return DateTime.fromJSDate(date)
    .minus(duration)
    .toJSDate();
}
