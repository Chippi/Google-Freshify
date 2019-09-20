import { dateToStep, stepToDate } from '../background/date';
import { SEND_ROLLING_TIME, totalSteps } from '../CONSTANTS';
import { durationStorage } from '../storage';
import { IMessageParams } from '../types';
import './content.scss';
import { animateSliderCircleToSelected, createDom, createSlider, ISliderOption } from './dom';
import { parser } from './parser';

document.addEventListener('DOMContentLoaded', () => init());

function sendToBackground(date?: Date) {
  const messageParams: IMessageParams = { timeParam: date, type: SEND_ROLLING_TIME };
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
function init() {
  // POC STUFF
  initPoc();

  const selectedDate = durationStorage.get();
  const selectedStep = dateToStep(selectedDate);
  const topNavElement = document.querySelector('#top_nav') as HTMLElement;

  const rangeOnChange = (rangeVal: number) => {
    const date = stepToDate(rangeVal);
    if (rangeVal === totalSteps) {
      sendToBackground();
    }
    return sendToBackground(date);
  };
  const fragment = createDom(selectedStep, rangeOnChange);
  topNavElement.before(fragment);

  const qInput = document.querySelector('[name="q"]');
  qInput.addEventListener('keypress', (e: KeyboardEvent) => {
    const key = e.which || e.keyCode;
    const ENTER = 13;
    if (key === ENTER) {
      const input = e.target as HTMLInputElement;
      const parsed = parser(input.value);
      if (parsed) {
        input.value = input.value.slice(0, parsed.hit.length * -1);
        sendToBackground(stepToDate(parsed.step));
      }
    }
  });
}

// POC STUFF
const initPoc = () => {
  const topNavElement = document.querySelector('#top_nav') as HTMLElement;

  const sliderOptions: ISliderOption[] = [
    {
      text: 'Today',
      superItem: true,
      duration: '1d',
    },
    {
      text: 'Yesterday',
      duration: '2d',
    },
    {
      text: '3 Days',
      duration: '3d',
      isSelected: true,
    },
    {
      text: '4 Days',
      duration: '4d',
    },
    {
      text: '5 Days',
      duration: '5d',
    },
    {
      text: '6 Days',
      duration: '6d',
    },
    {
      text: '7 Days',
      duration: '7d',
    },
    {
      text: '1 Week',
      duration: '1w',
      superItem: true,
    },
  ];

  const sliderFragment = createSlider(sliderOptions);
  topNavElement.before(sliderFragment);

  // animate selectedCircle to right spot after put into DOM
  animateSliderCircleToSelected(sliderOptions);
};
