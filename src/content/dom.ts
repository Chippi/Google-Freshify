import { storage } from '../storage';
import { click, DIV, P } from './domHelpers';
import {
  getSelectedOptionModelIndex,
  setSelectedOptionModel,
  sliderOptionsModel,
} from './sliderOptionsModel';

const sliderCircleRef = DIV('freshify__circle'); // Referenced to animate the circle

export const createSlider = () => {
  return DIV('freshify', [
    DIV('freshify__bar'),
    sliderCircleRef,
    DIV('display:flex;', sliderOptionsModel.map(option =>
      click((e) => {
        const { duration } = option;
        setSelectedOptionModel(duration);
        animateSliderCircleToSelected();
        addActiveStateToOption();
        storage.set(duration);
        window.location.reload();
      }, DIV(
        `freshify__option ${option.superItem ? 'freshify__option--super' : ''}`,
        [
          DIV('freshify__option--dot'),
          DIV('freshify__tooltip', P('', option.text)),
          option.superItem ? P('freshify__option--text', option.text) : undefined,
        ],
      ))[0] as HTMLElement
    ))
  ]);
};

export const animateSliderCircleToSelected = () => {
  const selectedIndex = getSelectedOptionModelIndex();
  const optionWidth = 19.5;

  const fromLeftSide = (selectedIndex + 1) * optionWidth;
  const justifyCirclePositionToCenterOfOption = optionWidth / 2 + sliderCircleRef.clientWidth / 2;
  const positionFromLeftInPixels = `${fromLeftSide - justifyCirclePositionToCenterOfOption}px`;

  sliderCircleRef.style.transform = `translateX(${positionFromLeftInPixels})`;

  enableTransitionsAfterInitialPositioning();
};

const enableTransitionsAfterInitialPositioning = () => {
  setTimeout(() => sliderCircleRef.classList.add('freshify__circle--transition-enabled'));
};

const addActiveStateToOption = () => {
  const selectedIndex = getSelectedOptionModelIndex();
  Array.from(document.querySelectorAll(".freshify__option")).forEach((item, index) =>
    item.classList.toggle('freshify__option--selected', index === selectedIndex)
  );
};
