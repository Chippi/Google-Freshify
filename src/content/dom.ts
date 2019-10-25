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
  const sliderWrapper = DIV('freshify');
  const options = createSliderOptions();

  sliderCircleRef = DIV('freshify__circle');
  sliderWrapper.append(DIV('freshify__bar'), sliderCircleRef, ...options);

  return sliderWrapper;
};

const createSliderOptions = () => {
  return sliderOptionsModel.map(option => {
    const sliderItem = DIV('freshify__option');
    sliderItems.push(sliderItem);
    sliderItem.dataset.duration = option.duration;

    sliderItem.addEventListener('click', e => {
      const duration = (e.currentTarget as HTMLElement).dataset.duration;
      setSelectedOptionModel(duration);
      animateSliderCircleToSelected();
      storage.set(duration);
      window.location.reload();
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
