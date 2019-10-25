import { DAYS, MONTHS, ParserUnit, WEEKS, YEARS } from '../CONSTANTS';
import { getDurationText } from '../durationHelpers';

export function createSliderModel(currentDuration): ISliderOptionModel[] {
  function generateSliderOptions(unit: ParserUnit): ISliderOptionModel[] {
    const count = AmountOfUnit.get(unit);
    return Array.from({ length: count }, (_, index) => {
      const duration = `${index + 1}${unit}`;
      const text = getDurationText(duration);
      return {
        superItem: index === 0,
        isSelected: currentDuration === duration,
        duration,
        text,
      };
    });
  }
  return [
    ...generateSliderOptions(ParserUnit.d),
    ...generateSliderOptions(ParserUnit.w),
    ...generateSliderOptions(ParserUnit.m),
    ...generateSliderOptions(ParserUnit.y),
    {
      duration: null,
      text: getDurationText(null),
      superItem: true,
      isSelected: currentDuration === null,
    },
  ];
}

const AmountOfUnit = new Map<ParserUnit, number>([
  [ParserUnit.d, DAYS],
  [ParserUnit.w, WEEKS],
  [ParserUnit.m, MONTHS],
  [ParserUnit.y, YEARS],
]);

export interface ISliderOptionModel {
    text: string;
    duration: string;
    superItem?: boolean;
    isSelected?: boolean;
  }
