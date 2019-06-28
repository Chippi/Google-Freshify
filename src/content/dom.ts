import { ANYTIME, DAYS, MONTHS, totalSteps, WEEKS, YEARS } from '../CONSTANTS';
import { DIV, P, RANGE } from './domHelpers';

const labelsPartial = () =>
  DIV('yolo__labels', [
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

export function dom(model: string, onChange: (val: number, e?: Event) => void) {
  const rangePartial = () => {
    const possibleSteps = DAYS + WEEKS + MONTHS + YEARS + ANYTIME;
    const range = RANGE(0, possibleSteps);

    range.value = model;
    range.onchange = (e: Event) => {
      const strValue = (e.target as HTMLInputElement).value;
      const val = Number(strValue);
      onChange(val, e);
    };

    return range;
  };
  console.log('step count', labelsPartial().children.length, totalSteps());
  return DIV('yolo__content', [rangePartial(), labelsPartial()]);
}
