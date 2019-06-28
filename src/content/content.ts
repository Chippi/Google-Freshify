import './content.scss';

import { STORAGE_TIME_KEY } from '../storage';
import { dom } from './dom';

const storedTimeParam = localStorage.getItem(STORAGE_TIME_KEY);
const selectedStep = storedTimeParam;
const onRangeChange = (rangeVal: number) => {
  console.log('range value', rangeVal);

  console.log('Changed range value and got this param:', rangeVal);

  chrome.runtime.sendMessage({ timeParam: rangeVal, type: 'SEND.ROLING.TIME' }, response => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.error('ERRRRRRRR', lastError);
      return;
    }
    localStorage.setItem(STORAGE_TIME_KEY, response.storageData);
    if (response.reload) {
      window.location.reload();
    }
  });
};

const init = () => {
  console.log('init - DOMContentLoaded');
  const topNavElement = document.querySelector('#top_nav') as HTMLElement;
  const fragment = dom(selectedStep, onRangeChange);
  topNavElement.before(fragment);

  console.log('Range should have been inserted now');
};

document.addEventListener('DOMContentLoaded', () => init());
