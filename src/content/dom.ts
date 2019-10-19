import { DIV, P } from './domHelpers';

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

  sliderCircleRef = DIV('freshify__circle');
  sliderWrapper.append(DIV('freshify__bar'), sliderCircleRef, ...options);

  return sliderWrapper;
};

const createSliderOptions = (sliderOptions: ISliderOption[], onSelect) => {
  return sliderOptions.map(option => {
    const sliderItem = DIV('freshify__option');
    sliderItem.dataset.duration = option.duration;

    sliderItem.addEventListener('click', e => {
      const duration = (e.currentTarget as HTMLElement).dataset.duration;
      sliderOptions.forEach(x => {
        x.isSelected = x.duration === duration;
      });
      animateSliderCircleToSelected(sliderOptions);
      onSelect(duration);
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