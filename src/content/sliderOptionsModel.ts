import { DAYS, MONTHS, ParserUnit, WEEKS, YEARS } from '../CONSTANTS';
import { getDurationText } from '../durationHelpers';

const AmountOfUnit = new Map<ParserUnit, number>([
  [ParserUnit.d, DAYS],
  [ParserUnit.w, WEEKS],
  [ParserUnit.m, MONTHS],
  [ParserUnit.y, YEARS],
]);

function generateSliderOptions(unit: ParserUnit): ISliderOptionModel[] {
  const count = AmountOfUnit.get(unit);
  return Array.from({ length: count }, (_, index) => {
    const duration = `${index + 1}${unit}`;
    const text = getDurationText(duration);
    return {
      superItem: index === 0,
      isSelected: false,
      duration,
      text,
    };
  });
}

export const sliderOptionsModel: ISliderOptionModel[] = [
  ...generateSliderOptions(ParserUnit.d),
  ...generateSliderOptions(ParserUnit.w),
  ...generateSliderOptions(ParserUnit.m),
  ...generateSliderOptions(ParserUnit.y),
  {
    duration: null,
    text: getDurationText(null),
    superItem: true,
    isSelected: false,
  },
];

export function getSelectedOptionModelIndex() {
  return sliderOptionsModel.findIndex(x => x.isSelected);
}

export function getSelectedOptionModel(): ISliderOptionModel {
  return sliderOptionsModel.find(o => o.isSelected);
}

export function setSelectedOptionModel(currentDuration) {
  sliderOptionsModel.forEach(o => (o.isSelected = o.duration === currentDuration));
}

interface ISliderOptionModel {
  text: string;
  duration: string;
  superItem?: boolean;
  isSelected?: boolean;
}
