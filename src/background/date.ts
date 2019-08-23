import { DateTime } from 'luxon';
import { DAYS, MONTHS, totalSteps, WEEKS, YEARS } from '../CONSTANTS';
const now = new Date();

function getPastDate(unit: string, amount: number): Date {
  const date = DateTime.fromJSDate(now)
    .minus({ [unit]: amount })
    .toJSDate();
  return date;
}

function getPossibleDates() {
  const possibleSliderDates: Date[] = [new Date(),
    ...Array.from({ length: DAYS }, (_, i) => getPastDate('days', i + 1 )),
    ...Array.from({ length: WEEKS }, (_, i) => getPastDate('weeks', i + 1 )),
    ...Array.from({ length: MONTHS }, (_, i) => getPastDate('months', i + 1 )),
    ...Array.from({ length: YEARS  }, (_, i) => getPastDate('years', i + 1 )),
  ];
  return possibleSliderDates;
}

export function stepToDate(step: number): Date {
  return getPossibleDates()[step];
}

export function dateToStep(date: Date): number {
    if (!date) {
        return totalSteps;
    }
    const dateTime = DateTime.fromJSDate(date);
    const diffs = getPossibleDates().map((d, i) => {
    const da = DateTime.fromJSDate(d);
    return da.diff(dateTime, 'days').toObject().days ;
  });

    const c = closest(diffs, 0);
    const index = diffs.indexOf(c);
    return index;
}

function closest(counts: number[], goal: number) {
    return counts.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
}
