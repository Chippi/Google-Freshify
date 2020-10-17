import { DateTime } from 'luxon';
import { storage, STORAGE_SAVE_IN_MINUTES } from '../storage';
import './content.scss';
import { animateSliderCircleToSelected, createSlider } from './dom';
import { parser } from './parser';
import { setSelectedOptionModel } from './sliderOptionsModel';

document.addEventListener('DOMContentLoaded', async () => {
  const lastUsedDate = await storage.getLastUsed();
  chrome.storage.sync.get(STORAGE_SAVE_IN_MINUTES, obj => {
    const expireMinutes = Number(obj[STORAGE_SAVE_IN_MINUTES] || 60);
    //console.log({ lastUsedDate, expireMinutes });
    if (!lastUsedDate || !expireMinutes) {
      init();
      return;
    }
    const expireDate = DateTime.fromJSDate(new Date()).minus({ minutes: expireMinutes });
    const diff = expireDate.diff(DateTime.fromJSDate(lastUsedDate), 'minutes').minutes;
    const hasExpired = diff > 0;
    // console.log({ hasExpired, expireMinutes });
    if (hasExpired) {
      storage.set(null).then(() => {
        init();
      });
    } else {
      init();
    }
  });
});

async function init() {
  const currentDuration = await storage.get();

  setSelectedOptionModel(currentDuration);

  const sliderFragment = createSlider();
  const topNavElement = document.querySelector('#top_nav') as HTMLElement;
  topNavElement.before(sliderFragment);

  // animate selectedCircle to right spot after put into DOM
  animateSliderCircleToSelected();

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
