export const SEND_ROLLING_TIME = 'SEND.ROLLING.TIME';

export const DAYS = 6;
export const WEEKS = 3;
export const MONTHS = 11;
export const YEARS = 10;
export const ANYTIME = 1;

export function totalSteps() {
  return DAYS + WEEKS + MONTHS + YEARS + ANYTIME;
}
