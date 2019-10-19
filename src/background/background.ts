import { SEND_ROLLING_TIME } from '../CONSTANTS';
import * as domains from '../domains.js';
import { getDate } from '../durationHelpers';
import { durationStorage } from '../storage';
import { IMessageParams } from '../types';

console.log('Hello from background, domains:', domains);

chrome.runtime.onMessage.addListener((request: IMessageParams, sender, sendResponse) => {
  if (request.type === SEND_ROLLING_TIME) {
    durationStorage.set(request.timeParam);
  }
  sendResponse({
    reload: true,
    storageData: request.timeParam,
  });
});

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const [url, qs] = details.url.split('?');
    const params = new URLSearchParams(qs);
    const isImageSearch = params.get('tbm') === 'isch';
    const duration = durationStorage.get();

    if (isImageSearch) {
      return;
    }
    if (duration) {
      const date = getDate(duration);
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
