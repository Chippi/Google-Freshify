import { DateTime } from 'luxon';
import { storage, STORAGE_TIME_KEY } from '../storage';
import { STORAGE_SAVE_IN_MINUTES } from './../storage';
import './content.scss';
import { animateSliderCircleToSelected, createSlider } from './dom';
import { parser } from './parser';
import { createSliderModel } from './sliderOptionsModel';

let currentDuration;

document.addEventListener('DOMContentLoaded', async () => {
  currentDuration = await storage.get();
  const lastUsedDate = await storage.getLastUsed();
  chrome.storage.sync.get(STORAGE_SAVE_IN_MINUTES, obj => {
    const expireMinutesStr = obj[STORAGE_SAVE_IN_MINUTES];
    if (!lastUsedDate || !expireMinutesStr) {
        init();
        return;
    }
    const expireMinutes = Number(expireMinutesStr);
    const expireDate = DateTime.fromJSDate(new Date()).minus({ minutes: expireMinutes });
    const diff = expireDate.diff(DateTime.fromJSDate(lastUsedDate), 'minutes').minutes;
    const hasExpired = diff > 0;
    console.log({ hasExpired, expireMinutes });
    if (hasExpired) {
      storage.set(null).then(() => {
        init();
      });
    } else {
      init();
    }
  });
});

function init() {
  const sliderOptions = createSliderModel(currentDuration);

  const sliderFragment = createSlider(sliderOptions, async duration => {
    await storage.set(duration);
    window.location.reload();
  });
  const topNavElement = document.querySelector('#top_nav') as HTMLElement;
  topNavElement.before(sliderFragment);

  // animate selectedCircle to right spot after put into DOM
  animateSliderCircleToSelected(sliderOptions);

  const qInput = document.querySelector('[name="q"]') as HTMLInputElement;
  qInput.addEventListener('keypress', (e: KeyboardEvent) => {
    const key = e.which || e.keyCode;
    const ENTER = 13;
    if (key === ENTER) {
      const input = e.target as HTMLInputElement;
      const parsed = parser(input.value);
      if (parsed) {
        storage.set(parsed.amount + parsed.unit);
        input.value = parsed.query;
      }
    }
  });
}
