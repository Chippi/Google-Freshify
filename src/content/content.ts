import './content.scss';

import { SEND_ROLLING_TIME, totalSteps } from '../CONSTANTS';

import { dateToStep, stepToDate } from '../background/date';
import { durationStorage } from '../storage';
import { IMessageParams } from '../types';
import { createDom } from './dom';
import { parser } from './parser';

document.addEventListener('DOMContentLoaded', () => init());

function sendToBackground(date?: Date) {
  const messageParams: IMessageParams = { timeParam: date, type: SEND_ROLLING_TIME };
  chrome.runtime.sendMessage(messageParams, response => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.error('Error', lastError);
      return;
    }
    if (response.storageData) {
      durationStorage.set(response.storageData);
    }

    if (response.reload) {
      window.location.reload();
    }
  });
}
function init() {
  const selectedDate = durationStorage.get();
  const selectedStep = dateToStep(selectedDate);
  const topNavElement = document.querySelector('#top_nav') as HTMLElement;

  const rangeOnChange = (rangeVal: number) => {
    const date = stepToDate(rangeVal);
    if (rangeVal === totalSteps) {
      sendToBackground();
    }
    return sendToBackground(date);
  };
  const fragment = createDom(selectedStep, rangeOnChange);
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
        sendToBackground(stepToDate(parsed.step));
      }
    }
  });
}
