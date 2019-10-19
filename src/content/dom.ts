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

export interface ISliderOption {
  text: string;
  duration: string;
  superItem?: boolean;
  isSelected?: boolean;
}

let sliderCircleRef: HTMLElement; // Used to animate the circle
let firstSliderOptionRef: HTMLElement; // Needed to get width for positioning calculations

export const createSlider = (sliderOptions: ISliderOption[], onSelect) => {
  const sliderWrapper = DIV('freshify');
  const options = createSliderOptions(sliderOptions, onSelect);

  firstSliderOptionRef = options[0];

  sliderCircleRef = DIV( 'freshify__circle');
  sliderWrapper.append(DIV('freshify__bar'), sliderCircleRef, ...options);

  return sliderWrapper;
};

const createSliderOptions = (sliderOptions: ISliderOption[], onSelect) => {
  return sliderOptions.map(option => {
    const sliderItem = DIV('freshify__option');

    sliderItem.addEventListener('click', () => {
      sliderOptions.forEach(x => {
        x.isSelected = x.text === option.text;
      });

      animateSliderCircleToSelected(sliderOptions);
      onSelect(option);
    });

    const sliderItemDot = DIV('freshify__option--dot');
    sliderItem.append(sliderItemDot, DIV('freshify__tooltip', P('', option.text)));

    if (option.superItem) {
      sliderItem.classList.add('freshify__option--super');
      sliderItem.append(P('freshify__option--text', option.text));
    }

    return sliderItem;
  });
};

export const animateSliderCircleToSelected = (sliderOptions: ISliderOption[]) => {
  const selectedIndex = sliderOptions.findIndex(x => x.isSelected);
  const optionWidth = firstSliderOptionRef.clientWidth;

  const fromLeftSide = (selectedIndex + 1) * optionWidth;
  const justifyCirclePositionToCenterOfOption = optionWidth / 2 + sliderCircleRef.clientWidth / 2;
  const positionFromLeftInPixels = `${fromLeftSide - justifyCirclePositionToCenterOfOption}px`;
  sliderCircleRef.style.transform = `translateX(${positionFromLeftInPixels})`;
};