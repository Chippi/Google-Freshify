import './content.scss';

console.log('hello from content');

const appBarElement = document.querySelector('#appbar') as HTMLElement;

import { STORAGE_TIME_KEY } from '../storage';
import { createFragment } from './fragment';
import { getGoogleTimeParam, mapToQdr } from './url';

const googleTimeParam = localStorage.getItem(STORAGE_TIME_KEY);

console.log('googleTimeParam', googleTimeParam);
let k;
mapToQdr.forEach((val, key) => {
  console.log(123, key, val);

  if (val === googleTimeParam) {
    k = key;
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

const fragment = createFragment(k, onRangeChange);
appBarElement.after(fragment);

console.log('YoloFilter should have been inserted now');
