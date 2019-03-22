const LABEL = (style, children?) => {
  return tag('label', style, children);
};
const DIV = (style, children?) => tag('div', style, children);
const RANGE = (style, model, onchange) => {
  const range = tag('input', style) as HTMLInputElement;
  range.type = 'range';
  range.min = '0';
  range.max = '4';
  range.value = model;
  range.autofocus = true;
  range.onchange = (e: any) => {
    const strValue = e.target.value;
    const val = Number(strValue);
    onchange(val, e);
  };
  return range;
};
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

const rangePartial = (model, onchange) => LABEL('', [RANGE('width: 100%', model, onchange)]);

function createFragment(model, callback) {
  return DIV('border: 1px solid blue', [rangePartial(model, callback), DIV('')]);
}

export { createFragment };
