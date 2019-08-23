import { DAYS, MONTHS, totalSteps, WEEKS, YEARS } from '../CONSTANTS';
import { DIV, P, RANGE } from './domHelpers';

type RangeOnChange = (val: number, e?: Event) => void;

const labelsPartial = () =>
  DIV('freshify__labels', [
    P('big-dot', 'Today'),
    ...Array.from({ length: DAYS }, () => P()),
    P('big-dot', '1 week'),
    ...Array.from({ length: WEEKS - 1 }, () => P()),
    P('big-dot', '1 month'),
    ...Array.from({ length: MONTHS - 1 }, () => P()),
    P('big-dot', '1 year'),
    ...Array.from({ length: YEARS - 1 }, () => P()),
    P('big-dot', 'Anytime'),
  ]);

const rangePartial = (rangeValue: number, onChange: RangeOnChange) => {
  const range = RANGE(0, totalSteps, rangeValue);
  range.onchange = (e: Event) => {
    const strValue = (e.target as HTMLInputElement).value;
    const val = Number(strValue);
    onChange(val, e);
  };
  return range;
};
export function createDom(rangeValue: number, onChange: RangeOnChange) {
  return DIV('freshify__content', [rangePartial(rangeValue, onChange), labelsPartial()]);
}
