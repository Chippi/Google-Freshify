import * as domains from '../domains.js';
import { STORAGE_TIME_KEY } from '../storage';

console.log(domains);

console.log('Hello from background');

chrome.runtime.onMessage.addListener(
  (request: { type: string; timeParam: string }, sender, sendResponse) => {
    if (request.type === 'SEND.ROLING.TIME') {
      localStorage.setItem(STORAGE_TIME_KEY, request.timeParam);
      console.log('background Stored, request.timeParam', request.timeParam);
    }
    sendResponse({
      reload: true,
      storageData: request.timeParam,
    });
  },
);

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const storage = localStorage.getItem(STORAGE_TIME_KEY);
    if (storage === null) {
      return;
    }
    const [url, qs] = details.url.split('?');
    const params = new URLSearchParams(qs);
    const isImageSearch = params.get('tbm') === 'isch';
    if (isImageSearch) {
      return;
    }

    params.set('tbs', storage);

    const redirectUrl = url + '?' + params.toString();
    console.log('onBeforeRequest end', params, redirectUrl);
    return { redirectUrl };
  },
  { urls: domains.map(domain => `https://*.google.${domain}/search*`) },
  ['blocking'],
);
