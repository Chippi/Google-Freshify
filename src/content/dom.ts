import { DAYS, MONTHS, totalSteps, WEEKS, YEARS } from '../CONSTANTS';
import { DIV, P, RANGE } from './domHelpers';

type RangeOnChange = (val: number, e?: Event) => void;

const labelsPartial = () =>
  DIV('freshify__labels', [
    P('big-dot', 'Today'),
    ...Array.from({ length: DAYS }, () => P()),
    P('big-dot', '1 week'),
    ...Array.from({ length: WEEKS - 1 }, () => P()),
    P('big-dot', '1 month'),
    ...Array.from({ length: MONTHS - 1 }, () => P()),
    P('big-dot', '1 year'),
    ...Array.from({ length: YEARS - 1 }, () => P()),
    P('big-dot', 'Anytime'),
  ]);

const rangePartial = (rangeValue: number, onChange: RangeOnChange) => {
  const range = RANGE(0, totalSteps, rangeValue);
  range.onchange = (e: Event) => {
    const strValue = (e.target as HTMLInputElement).value;
    const val = Number(strValue);
    onChange(val, e);
  };
  return range;
};
export function createDom(rangeValue: number, onChange: RangeOnChange) {
  return DIV('freshify__content', [rangePartial(rangeValue, onChange), labelsPartial()]);
}

/** Poc stuff below this, aka new slider */

// TODO: HENRIK
export const implementMeOnSelectDate = (sliderOption: ISliderOption) => {
  console.log(sliderOption);
};

export interface ISliderOption {
  text: string;
  duration: string;
  superItem?: boolean;
  isSelected?: boolean;
}

let sliderCircleRef: HTMLElement; // Used to animate the circle
let firstSliderOptionRef: HTMLElement; // Needed to get width for positioning calculations

export const createSlider = (sliderOptions: ISliderOption[]) => {
  const sliderWrapper = createDomElementHelper('DIV', 'freshify');
  const options = createSliderOptions(sliderOptions);

  firstSliderOptionRef = options[0];
  sliderWrapper.append(createSliderBar(), createSliderCircle(), ...options);

  return sliderWrapper;
};

const createSliderOptions = (sliderOptions: ISliderOption[]) => {
  return sliderOptions.map(option => {
    const sliderItem = createDomElementHelper('DIV', 'freshify__option');

    sliderItem.addEventListener('click', () => {
      sliderOptions.forEach(x => {
        x.isSelected = x.text === option.text;
      });

      animateSliderCircleToSelected(sliderOptions);
      implementMeOnSelectDate(option);
    });

    const sliderItemDot = createDomElementHelper('DIV', 'freshify__option--dot');
    sliderItem.append(sliderItemDot, createSliderOptionTooltip(option));

    if (option.superItem) {
      const sliderItemText = createDomElementHelper('p', 'freshify__option--text');
      sliderItemText.innerHTML = option.text;
      sliderItem.classList.add('freshify__option--super');
      sliderItem.append(sliderItemText);
    }

    return sliderItem;
  });
};

const createSliderOptionTooltip = (option: ISliderOption) => {
  const sliderTooltipContainer = createDomElementHelper('DIV', 'freshify__tooltip');
  const sliderTooltipText = createDomElementHelper('p');

  sliderTooltipText.innerHTML = option.text;
  sliderTooltipContainer.append(sliderTooltipText);

  return sliderTooltipContainer;
};

const createSliderBar = () => {
  return createDomElementHelper('DIV', 'freshify__bar');
};

const createSliderCircle = () => {
  const sliderCircle = createDomElementHelper('DIV', 'freshify__circle');

  sliderCircleRef = sliderCircle;

  return sliderCircle;
};

export const animateSliderCircleToSelected = (sliderOptions: ISliderOption[]) => {
  const selectedIndex = sliderOptions.findIndex(x => x.isSelected);
  const optionWidth = firstSliderOptionRef.clientWidth;

  const fromLeftSide = (selectedIndex + 1) * optionWidth;
  const justifyCirclePositionToCenterOfOption = optionWidth / 2 + sliderCircleRef.clientWidth / 2;
  const positionFromLeftInPixels = `${fromLeftSide - justifyCirclePositionToCenterOfOption}px`;

  sliderCircleRef.style.transform = `translateX(${positionFromLeftInPixels})`;
};

const createDomElementHelper = (elementType: string, elementClass?: string) => {
  const element = document.createElement(elementType);
  if (elementClass) {
    element.classList.add(elementClass);
  }

  return element;
};
