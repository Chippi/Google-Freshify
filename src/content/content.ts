import './content.scss';

import { DAYS, MONTHS, SEND_ROLLING_TIME, totalSteps, WEEKS } from '../CONSTANTS';
import { STORAGE_TIME_KEY } from '../storage';
import { dom } from './dom';
import { parser } from './parser';

document.addEventListener('DOMContentLoaded', () => init());

function sendToBackground(step: number) {
  chrome.runtime.sendMessage({ timeParam: step, type: SEND_ROLLING_TIME }, response => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.error('Error', lastError);
      return;
    }
    localStorage.setItem(STORAGE_TIME_KEY, response.storageData);
    if (response.reload) {
      window.location.reload();
    }
  });
}
function init() {
  const selectedStep = ((localStorage.getItem(STORAGE_TIME_KEY) as any) as number) || totalSteps();

  const topNavElement = document.querySelector('#top_nav') as HTMLElement;
  const fragment = dom(selectedStep, (rangeVal: number) => sendToBackground(rangeVal));
  topNavElement.before(fragment);

  const qInput = document.querySelector('[name="q"]');
  qInput.addEventListener('keypress', (e: KeyboardEvent) => {
    const key = e.which || e.keyCode;
    const ENTER = 13;
    if (key === ENTER) {
      const input = e.target as HTMLInputElement;
      const parsed = parser(input.value);
      if (parsed) {
        input.value = input.value.slice(0, parsed.hit.length * -1);
        sendToBackground(parsed.step);
      }
    }
  });
}
