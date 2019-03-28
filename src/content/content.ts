import './content.scss';

import { STORAGE_TIME_KEY } from '../storage';
import { getGoogleTimeParam, mapToQdr } from './url';
import { dom } from './dom';

console.log('hello from content');

const storedTimeParam = localStorage.getItem(STORAGE_TIME_KEY);

console.log('googleTimeParam', storedTimeParam);

let rangeValue;
mapToQdr.forEach((qdr, rangeStep) => {
  console.log(123, rangeStep, qdr);

  if (qdr === storedTimeParam) {
    rangeValue = rangeStep;
  }
});

const onRangeChange = (rangeVal: number) => {
  const timeParam = getGoogleTimeParam(rangeVal);
  console.log('Changed range value and got this google param:', timeParam);

  chrome.runtime.sendMessage({ timeParam, type: 'SEND.ROLING.TIME' }, response => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.log('ERRRRRRRR', lastError);
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

  const fragment = dom(rangeValue, onRangeChange);
  fragment.classList.add('yolo__content');

  topNavElement.before(fragment);

  console.log('YoloFilter should have been inserted now');
};

document.addEventListener('DOMContentLoaded', () => init());
