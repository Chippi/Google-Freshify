function tag(tagName: string, style: string = '', children?: HTMLElement[]) {
  const el = document.createElement(tagName);
  el.setAttribute('style', style);
  if (children) {
    children.forEach(e => {
      el.appendChild(e);
    });
  }

  return el;
}

const LABEL = (style: string, children?: HTMLElement[]) => {
  return tag('label', style, children);
};

const DIV = (style: string, children?: HTMLElement[]) => tag('div', style, children);

const RANGE = (min: number, max: number, style: string) => {
  const range = tag('input', style) as HTMLInputElement;
  range.type = 'range';
  range.min = min.toString();
  range.max = max.toString();
  return range;
};

function createFragment(model, _onchange: (val: number, e: Event) => void) {
  const rangePartial = () => {
    const range = RANGE(
      0,
      5,
      `
      width: 600px;
      margin-left: 170px;
    `,
    );

    range.value = model;
    range.autofocus = true;
    range.onchange = (e: any) => {
      const strValue = e.target.value;
      const val = Number(strValue);
      _onchange(val, e);
    };

    return LABEL('', [range]);
  };

  return DIV('margin-bottom:20px;', [rangePartial(), DIV('')]);
}

export { createFragment };
