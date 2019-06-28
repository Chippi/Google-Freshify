import { DateTime } from 'luxon';
import * as domains from '../domains.js';
import { STORAGE_TIME_KEY } from '../storage';
import { DAYS, MONTHS, WEEKS, YEARS } from './../CONSTANTS';

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
    const date = calculateDate(parseFloat(storage));

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

function calculateDate(rangeVal: number): Date | null {
  const date = new Date();

  if (rangeVal <= DAYS) {
    const days = rangeVal;
    console.log('minus days', days);
    return DateTime.fromJSDate(date)
      .minus({ days })
      .toJSDate();
  }

  if (rangeVal <= DAYS + WEEKS) {
    const weeks = rangeVal - DAYS;
    console.log('minus weeks', weeks);
    return DateTime.fromJSDate(date)
      .minus({ weeks })
      .toJSDate();
  }

  if (rangeVal <= DAYS + WEEKS + MONTHS) {
    const months = rangeVal - DAYS - WEEKS;
    console.log('minus months', months);
    return DateTime.fromJSDate(date)
      .minus({ months })
      .toJSDate();
  }

  if (rangeVal <= DAYS + WEEKS + MONTHS + YEARS) {
    const years = rangeVal - DAYS - WEEKS - MONTHS;
    console.log('minus years', years);
    return DateTime.fromJSDate(date)
      .minus({ years })
      .toJSDate();
  }

  console.log('minus nothing ANYTIME');
  return null;
}
