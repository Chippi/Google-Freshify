import { SEND_ROLLING_TIME } from '../CONSTANTS';
import * as domains from '../domains.js';
import { STORAGE_TIME_KEY } from '../storage';
import { IMessageParams } from '../types';

console.log('Hello from background, domains:', domains);

chrome.runtime.onMessage.addListener((request: IMessageParams, sender, sendResponse) => {
  if (request.type === SEND_ROLLING_TIME) {
    localStorage.setItem(STORAGE_TIME_KEY, JSON.stringify(request.timeParam));
    console.log('background Stored, request.timeParam', request.timeParam);
  }
  sendResponse({
    reload: true,
    storageData: request.timeParam,
  });
});

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const storage = localStorage.getItem(STORAGE_TIME_KEY);
    if (!storage) {
      return;
    }
    const date = new Date(JSON.parse(storage));
    if (date === null) {
      return;
    }
    const [url, qs] = details.url.split('?');
    const params = new URLSearchParams(qs);
    const isImageSearch = params.get('tbm') === 'isch';
    if (isImageSearch) {
      return;
    }

    if (date) {
      params.set('tbs', `cdr:1,cd_min:${new Intl.DateTimeFormat('en-US').format(date)}`);
    } else {
      params.set('tbs', ``);
    }

    const redirectUrl = `${url}?${params.toString()}`;
    return { redirectUrl };
  },
  { urls: domains.map(domain => `https://*.google.${domain}/search*`) },
  ['blocking'],
);
