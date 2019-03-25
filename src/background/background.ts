import { parseQuerystring, toQuerystring } from '../content/url';
import { STORAGE_TIME_KEY } from '../storage';

console.log('Hello from background');

chrome.runtime.onMessage.addListener(
  (request: { type: string; timeParam: string }, sender, sendResponse) => {
    if (request.type === 'SEND.ROLING.TIME') {
      localStorage.setItem(STORAGE_TIME_KEY, request.timeParam);
      console.log('background Stored time key', request.timeParam);
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
    console.log('background get time key', storage);
    if (storage === null) {
      return;
    }

    const [url, qs] = details.url.split('?');

    const params = parseQuerystring(qs);

    const isImageSearch = params.tbm === 'isch';
    if (isImageSearch) {
      return;
    }

    params.tbs = storage;

    const complete = url + '?' + toQuerystring(params);
    console.log('onBeforeRequest end', params, complete);
    return { redirectUrl: complete };
  },
  { urls: ['https://*.google.com/search*'] },
  ['blocking'],
);
