import { DAYS, MONTHS, SEND_ROLLING_TIME, totalSteps, WEEKS, YEARS } from '../CONSTANTS';
import { durationStorage } from '../storage';
import { IMessageParams } from '../types';
import './content.scss';
import './content.scss';
import { animateSliderCircleToSelected, createDom, createSlider, ISliderOption } from './dom';
import { parser, ParserUnit } from './parser';

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
function init() {
  // POC STUFF
  initPoc();

  const duration = durationStorage.get();
  const step = duration ? durationToStep(duration) : totalSteps;
  console.log('step', step, duration);
  const topNavElement = document.querySelector('#top_nav') as HTMLElement;

  const rangeOnChange = (rangeVal: number) => {
    // const date = stepToDate(rangeVal);
    if (rangeVal === totalSteps) {
      sendToBackground();
    }
    sendToBackground(stepToDuration(rangeVal));
  };
  const fragment = createDom(step, rangeOnChange);
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
        sendToBackground(parsed.step + 'd');
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
function stepToDuration(rangeVal: number): string {
  if (rangeVal <= DAYS) {
    return `${rangeVal}d`;
  } else if (rangeVal <= DAYS + WEEKS) {
    return `${rangeVal - DAYS}w`;
  } else if (rangeVal <= DAYS + WEEKS + MONTHS) {
    return `${rangeVal - DAYS - WEEKS}m`;
  } else if (rangeVal <= DAYS + WEEKS + MONTHS + YEARS) {
    const amount = rangeVal - DAYS - WEEKS - MONTHS;
    if (amount <= 10) {
      return `${amount}y`;
    }
  }
  console.log('ANYTIME!');
  return null;
}

function durationToStep(duration: string): number {
  const unit = duration.slice(-1) as ParserUnit;
  const amount = Number(duration.slice(0, -1));

  switch (unit) {
    case 'd':
      return amount;
    case 'w':
      return amount + DAYS;
    case 'm':
      return amount + WEEKS + DAYS;
    case 'y':
      return amount + MONTHS + WEEKS + DAYS;
  }
}
