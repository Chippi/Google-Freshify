import { tag, event } from 'tiny-html-builder';

export const DIV = (style: string, children?) => tag('div', style, children);
export const P = (style?: string, children?) => tag('p', style, children);
export const click = (callback: EventListener | EventListenerObject, children) => event("click", callback, children);
