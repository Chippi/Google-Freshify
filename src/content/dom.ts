import { RANGE, DIV, P } from './domHelpers';

const labelsPartial = () =>
  DIV('yolo__labels', [
    P('', ['1 hour']),
    P('', ['1 day']),
    P('', ['1 week']),
    P('', ['1 month']),
    P('', ['1 year']),
    P('', ['Any time']),
  ]);

export function dom(model: number, onChange: (val: number, e?: Event) => void) {
  const rangePartial = () => {
    const range = RANGE(0, 5, ``);

    range.value = model.toString();
    range.onchange = (e: any) => {
      const strValue = e.target.value;
      const val = Number(strValue);
      onChange(val, e);
    };

    return range;
  };

  return DIV('yolo__content', [rangePartial(), labelsPartial()]);
}
