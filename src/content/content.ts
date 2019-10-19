import { DAYS, MONTHS, SEND_ROLLING_TIME, WEEKS, YEARS } from '../CONSTANTS';
import { durationStorage } from '../storage';
import { IMessageParams, ParserUnit } from '../types';
import './content.scss';
import { animateSliderCircleToSelected, createSlider, ISliderOption } from './dom';
import { getDurationText } from '../durationHelpers';
import { parser } from './parser';

document.addEventListener('DOMContentLoaded', () => init());

function sendToBackground(duration?: string) {
  durationStorage.set(duration);
  const messageParams: IMessageParams = { timeParam: duration, type: SEND_ROLLING_TIME };
  chrome.runtime.sendMessage(messageParams, response => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.error('Error', lastError);
      return;
    }
    if (response.storageData) {
      durationStorage.set(response.storageData);
    }
    if (response.reload) {
      window.location.reload();
    }
  });
}

const init = () => {
  const currentDuration = durationStorage.get();
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
      }
    });
  }

  const sliderOptions: ISliderOption[] = [
    ...generateSliderOptions(ParserUnit.d),
    ...generateSliderOptions(ParserUnit.w),
    ...generateSliderOptions(ParserUnit.m),
    ...generateSliderOptions(ParserUnit.y),
    {
      duration: null,
      text: getDurationText(null),
      superItem: true,
      isSelected: currentDuration === null
    }
  ];

  const sliderFragment = createSlider(sliderOptions, duration => {
    sendToBackground(duration)
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
        durationStorage.set(parsed.amount + parsed.unit)
        input.value = parsed.query;
        sendToBackground(parsed.amount + parsed.unit)
      }
    }
  });
};

const AmountOfUnit = new Map<ParserUnit, number>([
  [ParserUnit.d, DAYS],
  [ParserUnit.w, WEEKS],
  [ParserUnit.m, MONTHS],
  [ParserUnit.y, YEARS]
]); 