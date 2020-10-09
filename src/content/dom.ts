import { storage } from '../storage';
import { click, DIV, P } from './domHelpers';
import {
  getSelectedOptionModelIndex,
  setSelectedOptionModel,
  sliderOptionsModel,
} from './sliderOptionsModel';

const sliderItems: HTMLElement[] = [];
let sliderCircleRef: HTMLElement; // Used to animate the circle

const sliderOptions = sliderOptionsModel.map(option => {
  const sliderItem = click(() => {
    const duration = option.duration;
    setSelectedOptionModel(duration);
    animateSliderCircleToSelected();
    storage.set(duration);
    window.location.reload();
  }, DIV(
    `freshify__option ${option.superItem ? 'freshify__option--super' : ''}`,
    [
      DIV('freshify__option--dot'),
      DIV('freshify__tooltip', P('', option.text)),
      option.superItem ? P('freshify__option--text', option.text) : undefined,
    ],
  ));
  sliderItems.push(sliderItem[0]);
  return sliderItem[0];
});

export const createSlider = () => {
  sliderCircleRef = DIV('freshify__circle');
  return DIV('freshify', [DIV('freshify__bar'), sliderCircleRef, ...sliderOptions]);
};

export const animateSliderCircleToSelected = () => {
  const selectedIndex = getSelectedOptionModelIndex();
  const optionWidth = 19.5;

  const fromLeftSide = (selectedIndex + 1) * optionWidth;
  const justifyCirclePositionToCenterOfOption = optionWidth / 2 + sliderCircleRef.clientWidth / 2;
  const positionFromLeftInPixels = `${fromLeftSide - justifyCirclePositionToCenterOfOption}px`;

  sliderCircleRef.style.transform = `translateX(${positionFromLeftInPixels})`;

  enableTransitionsAfterInitialPositioning();
  addActiveStateToOption(selectedIndex);
};

const enableTransitionsAfterInitialPositioning = () => {
  setTimeout(() => sliderCircleRef.classList.add('freshify__circle--transition-enabled'));
};

const addActiveStateToOption = (selectedIndex: number) => {
  sliderItems.forEach((item, index) =>
    item.classList.toggle('freshify__option--selected', index === selectedIndex)
  );
};
