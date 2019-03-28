type ElementOrText = HTMLElement | string;

function tag(tagName: string, style: string = '', children?: ElementOrText[]) {
  const el = document.createElement(tagName);
  if (style) style.includes(':') ? el.setAttribute('style', style) : el.classList.add(style);

  if (children) {
    children.forEach(e => {
      el.append(e);
    });
  }

  return el;
}

const DIV = (style: string, children?: ElementOrText[]) => tag('div', style, children);
const P = (style: string, children?: ElementOrText[]) => tag('p', style, children);
const RANGE = (min: number, max: number, style: string) => {
  const range = tag('input', style) as HTMLInputElement;
  range.type = 'range';
  range.min = min.toString();
  range.max = max.toString();
  return range;
};

const createLabels = () =>
  DIV('yolo__labels', [
    P('', ['1 hour']),
    P('', ['1 day']),
    P('', ['1 week']),
    P('', ['1 month']),
    P('', ['1 year']),
    P('', ['Any time']),
  ]);

export function createFragment(model, onChange: (val: number, e?: Event) => void) {
  const rangePartial = () => {
    const range = RANGE(0, 5, ``);

    range.value = model;
    range.onchange = (e: any) => {
      const strValue = e.target.value;
      const val = Number(strValue);
      onChange(val, e);
    };

    return range;
  };

  return DIV('', [rangePartial(), createLabels()]);
}
