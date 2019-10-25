import { DateTime } from 'luxon';
import { DAYS, MONTHS, ParserUnit, WEEKS, YEARS } from '../CONSTANTS';
import { getDurationText } from '../durationHelpers';
import { storage } from '../storage';
import { STORAGE_SAVE_IN_MINUTES } from './../storage';
import './content.scss';
import { animateSliderCircleToSelected, createSlider, ISliderOption } from './dom';
import { parser } from './parser';

let currentDuration;

document.addEventListener('DOMContentLoaded', async () => {
  currentDuration = await storage.get();
  const lastUsedDate = await storage.getLastUsed();
  chrome.storage.sync.get(STORAGE_SAVE_IN_MINUTES, obj => {
    if (!lastUsedDate) {
      return;
    }
    const expireMinutes = Number(obj[STORAGE_SAVE_IN_MINUTES]);
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
  const sliderOptions: ISliderOption[] = [
    ...generateSliderOptions(ParserUnit.d),
    ...generateSliderOptions(ParserUnit.w),
    ...generateSliderOptions(ParserUnit.m),
    ...generateSliderOptions(ParserUnit.y),
    {
      duration: null,
      text: getDurationText(null),
      superItem: true,
      isSelected: currentDuration === null,
    },
  ];

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
function generateSliderOptions(unit: ParserUnit): ISliderOption[] {
  const count = AmountOfUnit.get(unit);
  return Array.from({ length: count }, (_, index) => {
    const duration = `${index + 1}${unit}`;
    const text = getDurationText(duration);
    return {
      superItem: index === 0,
      isSelected: currentDuration === duration,
      duration,
      text,
    };
  });
}

const AmountOfUnit = new Map<ParserUnit, number>([
  [ParserUnit.d, DAYS],
  [ParserUnit.w, WEEKS],
  [ParserUnit.m, MONTHS],
  [ParserUnit.y, YEARS],
]);
