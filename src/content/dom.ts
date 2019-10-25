import { storage } from '../storage';
import { DIV, P } from './domHelpers';
import {
  getSelectedOptionModelIndex,
  setSelectedOptionModel,
  sliderOptionsModel,
} from './sliderOptionsModel';

const sliderItems: HTMLElement[] = [];
let sliderCircleRef: HTMLElement; // Used to animate the circle

export const createSlider = () => {
  sliderCircleRef = DIV('freshify__circle');
  return DIV('freshify', [DIV('freshify__bar'), sliderCircleRef, ...createSliderOptions()]);
};

const createSliderOptions = () => {
  return sliderOptionsModel.map(option => {
    const sliderItem = DIV(
      `freshify__option ${option.superItem ? 'freshify__option--super' : ''}`,
      [
        DIV('freshify__option--dot'),
        DIV('freshify__tooltip', P('', option.text)),
        option.superItem ? P('freshify__option--text', option.text) : undefined,
      ],
    );
    sliderItem.dataset.duration = option.duration;

    sliderItem.addEventListener('click', e => {
      const duration = (e.currentTarget as HTMLElement).dataset.duration;
      setSelectedOptionModel(duration);
      animateSliderCircleToSelected();
      storage.set(duration);
      window.location.reload();
    });

    sliderItems.push(sliderItem);

    return sliderItem;
  });
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
  sliderItems.forEach((item, index) => {
    item.classList.remove('freshify__option--selected');

    index === selectedIndex
      ? item.classList.add('freshify__option--selected')
      : item.classList.remove('freshify__option--selected');
  });
};
