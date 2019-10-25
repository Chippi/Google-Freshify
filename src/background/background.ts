import * as domains from '../domains.js';
import { getDate } from '../durationHelpers';
import { STORAGE_TIME_KEY } from '../storage';

console.log('Hello from background, domains:', domains);

let duration = null;
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes[STORAGE_TIME_KEY]) {
    duration = changes[STORAGE_TIME_KEY].newValue;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const [url, qs] = details.url.split('?');
    const params = new URLSearchParams(qs);
    const isImageSearch = params.get('tbm') === 'isch';
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
