import { ANYTIME, DAYS, MONTHS, WEEKS, YEARS } from '../CONSTANTS';
import { DIV, P, RANGE } from './domHelpers';

const labelsPartial = () =>
  DIV('yolo__labels', [
    P('', '1 day'),
    P('', '1 week'),
    P('', '1 month'),
    P('', '1 year'),
    P('', 'Any time'),
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

  return DIV('yolo__content', [rangePartial(), labelsPartial()]);
}
