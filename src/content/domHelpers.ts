type ElementOrText = HTMLElement | HTMLElement[] | string;

function tag(tagName: string, style: string = '', children?: ElementOrText) {
  const el = document.createElement(tagName);
  if (style) {
    style.includes(':') ? el.setAttribute('style', style) : el.classList.add(style);
  }
  if (children) {
    el.append(...(Array.isArray(children) ? children : [children]));
  }
  return el;
}

export const DIV = (style: string, children?: ElementOrText) => tag('div', style, children);
export const P = (style?: string, children?: ElementOrText) => tag('p', style, children);
